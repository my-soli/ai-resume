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

FREE_TIER_LIMIT = 5

SYSTEM_PROMPT = """You are a senior resume writer and ATS optimization specialist who has helped 10,000+ candidates land roles at top companies including FAANG, Fortune 500, and leading startups.

YOUR MISSION: Generate polished, interview-winning resumes that pass ATS systems AND impress human recruiters.

STRICT OUTPUT RULES:
1. Output ONLY valid JSON — no markdown, no prose, no code fences
2. Every bullet point must start with a strong past-tense action verb (Led, Built, Increased, Reduced, Delivered, Architected, Designed, Launched, Negotiated, Managed, Optimized, Spearheaded)
3. Quantify EVERY achievement — use real or realistic metrics (%, $, time, team size, scale). Example: "Reduced API latency by 40% through query optimization" not "Improved performance"
4. The professional summary must be 3 compelling sentences: who you are → your key value proposition → your career goal
5. Each work experience entry must have 3-5 achievement bullets, not just duties
6. Skills must be specific and relevant — group them logically (Languages, Frameworks, Tools, Platforms)
7. ATS keywords must be embedded naturally in context — never listed awkwardly
8. Structure for ATS parsing: use plain text, no tables, no graphics, no special unicode characters
9. When a job description is provided, mirror its exact language and prioritize matching keywords
10. The resume_text must be a complete, formatted, ready-to-use plain text resume — not a summary

QUALITY STANDARDS:
- Every bullet tells a story: Action → Task → Result
- Be specific: "Python, FastAPI, PostgreSQL" not "backend technologies"
- Be impressive but truthful: enhance the framing, not the facts
- Length: 1 page for <5 years experience, 2 pages for senior roles

REQUIRED JSON OUTPUT SCHEMA:
{
  "resume_text": "<COMPLETE formatted resume as plain text — must include ALL sections with full content, ready to copy-paste>",
  "ats_score": <integer 0-100>,
  "improvements": ["<specific, actionable improvement with the exact change to make>"],
  "keywords_used": ["<keyword1>", "<keyword2>"],
  "structured_sections": {
    "summary": "<3 sentence professional summary — who you are, your value, your goal>",
    "experience": [{"company": "", "position": "", "bullets": ["<Action verb + task + quantified result>"]}],
    "education": [{"institution": "", "degree": "", "field": ""}],
    "skills": ["skill1", "skill2"],
    "projects": [{"name": "", "description": "<what it does + tech stack + impact>", "impact": "<measurable outcome>"}]
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

    async def parse_cv_text(self, cv_text: str) -> dict:
        prompt = (
            "Parse this CV/resume into structured JSON. "
            "Extract information EXACTLY as written — do NOT enhance or rewrite.\n\n"
            f"CV TEXT:\n{cv_text[:8000]}\n\n"
            "Return ONLY this JSON (leave empty string/array for missing fields):\n"
            '{"title":"","personal_info":{"name":"","email":"","phone":"","location":"",'
            '"linkedin":"","github":"","website":"","summary":""},'
            '"work_experience":[{"company":"","position":"","start_date":"","end_date":"",'
            '"current":false,"description":"","achievements":[]}],'
            '"education":[{"institution":"","degree":"","field":"","start_date":"","end_date":"","gpa":""}],'
            '"skills":[],'
            '"projects":[{"name":"","description":"","technologies":[],"url":""}],'
            '"job_description":""}'
        )
        try:
            response = await self.client.chat.completions.create(
                model=settings.GROQ_MODEL,
                messages=[
                    {"role": "system", "content": "You are a resume parser. Extract information from CVs into structured JSON. Return ONLY valid JSON, nothing else."},
                    {"role": "user", "content": prompt},
                ],
                response_format={"type": "json_object"},
                temperature=0.1,
                max_tokens=4096,
            )
            return json.loads(response.choices[0].message.content)
        except json.JSONDecodeError:
            raise HTTPException(status_code=502, detail="CV parsing returned malformed JSON")
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"CV parsing failed: {str(e)}")

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
            f"\nTARGET JOB DESCRIPTION (tailor EVERY section to match this role's language and keywords):\n{resume.job_description}"
            if resume.job_description
            else ""
        )
        return (
            f"Generate a complete, polished, interview-winning resume from the career details below.\n"
            f"Requirements:\n"
            f"- Write a powerful 3-sentence professional summary that grabs attention\n"
            f"- Transform every job duty into an achievement bullet with metrics\n"
            f"- If metrics are missing, infer realistic ones based on the role and industry\n"
            f"- Make the resume_text field a COMPLETE, formatted, copy-paste-ready resume\n"
            f"- Provide 5-8 specific, actionable improvements\n"
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
                temperature=0.6,
                max_tokens=8000,
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
