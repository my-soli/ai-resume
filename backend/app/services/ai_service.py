import json
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func
from fastapi import HTTPException, status
import openai
from app.models.resume import Resume
from app.models.ai_result import AIResult
from app.models.user import User
from app.schemas.ai import AIResultResponse
from app.core.openai_client import get_openai_client
from app.core.config import settings

FREE_TIER_LIMIT = 3

SYSTEM_PROMPT = """You are an expert resume writer and ATS (Applicant Tracking System) optimization specialist with 15+ years of experience helping candidates land interviews at top companies.

YOUR MISSION: Analyze, generate, and optimize resumes for maximum ATS compatibility and professional impact.

STRICT RULES:
1. Output ONLY valid JSON — no markdown, no prose, no code fences
2. Use strong action verbs: led, developed, implemented, optimized, increased, reduced, delivered, architected
3. Quantify achievements with specific metrics (%, $, time saved, team size)
4. Embed industry-relevant ATS keywords naturally — never keyword-stuff
5. Maintain professional, concise language — no fluff
6. Structure for ATS parsing: no tables, graphics, or special characters
7. When a job description is provided, tailor every section to that role

REQUIRED JSON OUTPUT SCHEMA:
{
  "resume_text": "<complete formatted resume as plain text with clear section headers>",
  "ats_score": <integer 0-100>,
  "improvements": ["<specific actionable improvement 1>", "<specific actionable improvement 2>"],
  "keywords_used": ["<keyword1>", "<keyword2>"],
  "structured_sections": {
    "summary": "<2-3 sentence professional summary>",
    "experience": [{"company": "", "position": "", "bullets": []}],
    "education": [{"institution": "", "degree": "", "field": ""}],
    "skills": ["skill1", "skill2"],
    "projects": [{"name": "", "description": "", "impact": ""}]
  }
}"""


class AIService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.client = get_openai_client()

    async def generate_resume(self, resume_id: str, user_id: str) -> AIResultResponse:
        await self._check_usage_limit(user_id)
        resume = await self._get_resume(resume_id, user_id)
        prompt = self._build_generate_prompt(resume)
        result = await self._call_openai(prompt)
        return await self._save_result(resume_id, "generate", result)

    async def improve_resume(self, resume_id: str, user_id: str) -> AIResultResponse:
        await self._check_usage_limit(user_id)
        resume = await self._get_resume(resume_id, user_id)
        prompt = self._build_improve_prompt(resume)
        result = await self._call_openai(prompt)
        return await self._save_result(resume_id, "improve", result)

    async def score_resume(self, resume_id: str, user_id: str) -> AIResultResponse:
        await self._check_usage_limit(user_id)
        resume = await self._get_resume(resume_id, user_id)
        prompt = self._build_score_prompt(resume)
        result = await self._call_openai(prompt)
        return await self._save_result(resume_id, "score", result)

    async def get_usage(self, user_id: str) -> dict:
        user_result = await self.db.execute(select(User).where(User.id == user_id))
        user = user_result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        month_start = datetime.now(timezone.utc).replace(
            day=1, hour=0, minute=0, second=0, microsecond=0
        )
        count_result = await self.db.execute(
            select(func.count(AIResult.id))
            .join(Resume, AIResult.resume_id == Resume.id)
            .where(
                and_(Resume.user_id == user_id, AIResult.created_at >= month_start)
            )
        )
        count = count_result.scalar() or 0
        return {
            "is_pro": user.is_pro,
            "calls_used": count,
            "calls_limit": None if user.is_pro else FREE_TIER_LIMIT,
        }

    async def get_latest_result(
        self, resume_id: str, user_id: str
    ) -> AIResultResponse | None:
        await self._get_resume(resume_id, user_id)
        result = await self.db.execute(
            select(AIResult)
            .where(AIResult.resume_id == resume_id)
            .order_by(AIResult.created_at.desc())
            .limit(1)
        )
        ai_result = result.scalar_one_or_none()
        if not ai_result:
            return None
        return AIResultResponse.model_validate(ai_result)

    async def get_all_results(
        self, resume_id: str, user_id: str
    ) -> list[AIResultResponse]:
        await self._get_resume(resume_id, user_id)
        result = await self.db.execute(
            select(AIResult)
            .where(AIResult.resume_id == resume_id)
            .order_by(AIResult.created_at.desc())
        )
        return [AIResultResponse.model_validate(r) for r in result.scalars().all()]

    async def _check_usage_limit(self, user_id: str) -> None:
        user_result = await self.db.execute(select(User).where(User.id == user_id))
        user = user_result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        if user.is_pro:
            if (
                user.subscription_expires_at
                and datetime.now(timezone.utc) > user.subscription_expires_at
            ):
                user.is_pro = False
                await self.db.commit()
            else:
                return

        month_start = datetime.now(timezone.utc).replace(
            day=1, hour=0, minute=0, second=0, microsecond=0
        )
        count_result = await self.db.execute(
            select(func.count(AIResult.id))
            .join(Resume, AIResult.resume_id == Resume.id)
            .where(
                and_(Resume.user_id == user_id, AIResult.created_at >= month_start)
            )
        )
        count = count_result.scalar() or 0
        if count >= FREE_TIER_LIMIT:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail=f"Free limit of {FREE_TIER_LIMIT} AI operations/month reached. Upgrade to Pro for unlimited access.",
            )

    async def _get_resume(self, resume_id: str, user_id: str) -> Resume:
        result = await self.db.execute(
            select(Resume).where(
                and_(Resume.id == resume_id, Resume.user_id == user_id)
            )
        )
        resume = result.scalar_one_or_none()
        if not resume:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found"
            )
        return resume

    def _resume_to_dict(self, resume: Resume) -> dict:
        return {
            "personal_info": resume.personal_info,
            "work_experience": resume.work_experience,
            "education": resume.education,
            "skills": resume.skills,
            "projects": resume.projects,
        }

    def _build_generate_prompt(self, resume: Resume) -> str:
        jd_section = (
            f"\nTARGET JOB DESCRIPTION:\n{resume.job_description}"
            if resume.job_description
            else ""
        )
        return (
            f"Generate a complete, ATS-optimized resume from the career details below."
            f"{jd_section}\n\n"
            f"CAREER DETAILS:\n{json.dumps(self._resume_to_dict(resume), indent=2)}\n\n"
            f"Return ONLY the JSON object specified in your instructions."
        )

    def _build_improve_prompt(self, resume: Resume) -> str:
        jd_section = (
            f"\nTARGET JOB DESCRIPTION:\n{resume.job_description}"
            if resume.job_description
            else ""
        )
        return (
            f"Analyze and rewrite this resume for maximum ATS compatibility and impact."
            f"{jd_section}\n\n"
            f"CURRENT RESUME:\n{json.dumps(self._resume_to_dict(resume), indent=2)}\n\n"
            f"Focus on: stronger verbs, quantified achievements, ATS keyword density, conciseness.\n"
            f"Return ONLY the JSON object specified in your instructions."
        )

    def _build_score_prompt(self, resume: Resume) -> str:
        jd_section = (
            f"\nTARGET JOB DESCRIPTION:\n{resume.job_description}"
            if resume.job_description
            else ""
        )
        return (
            f"Score this resume for ATS compatibility and provide a full optimized rewrite."
            f"{jd_section}\n\n"
            f"RESUME:\n{json.dumps(self._resume_to_dict(resume), indent=2)}\n\n"
            f"Be harsh and specific in the improvements list. Score honestly.\n"
            f"Return ONLY the JSON object specified in your instructions."
        )

    async def _call_openai(self, prompt: str) -> dict:
        try:
            response = await self.client.chat.completions.create(
                model=settings.GROQ_MODEL,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt},
                ],
                response_format={"type": "json_object"},
                temperature=0.7,
                max_tokens=4096,
            )
            data = json.loads(response.choices[0].message.content)
            return {
                "resume_text": data.get("resume_text", ""),
                "ats_score": max(0, min(100, int(data.get("ats_score", 0)))),
                "improvements": data.get("improvements", []),
                "keywords_used": data.get("keywords_used", []),
                "structured_data": data.get("structured_sections", {}),
            }
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="AI returned malformed JSON",
            )
        except openai.RateLimitError:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="AI rate limit reached. Please wait a moment and try again.",
            )
        except openai.AuthenticationError:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="AI service misconfigured. Contact support.",
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"AI service error: {str(e)}",
            )

    async def _save_result(
        self, resume_id: str, operation: str, data: dict
    ) -> AIResultResponse:
        result = AIResult(
            resume_id=resume_id,
            operation=operation,
            resume_text=data["resume_text"],
            ats_score=data["ats_score"],
            improvements=data["improvements"],
            keywords_used=data["keywords_used"],
            structured_data=data["structured_data"],
        )
        self.db.add(result)
        await self.db.commit()
        await self.db.refresh(result)
        return AIResultResponse.model_validate(result)
