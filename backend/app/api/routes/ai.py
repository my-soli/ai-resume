from fastapi import APIRouter, Depends, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.core.security import get_current_user_id
from app.core.config import settings
from pydantic import BaseModel
from fastapi import HTTPException
from app.schemas.ai import (
    AIResultResponse,
    GenerateResumeRequest,
    ImproveResumeRequest,
    ScoreResumeRequest,
)

class CoverLetterRequest(BaseModel):
    resume_id: str
    company_name: str = ""
    job_title: str = ""

class PublicScoreRequest(BaseModel):
    cv_text: str
from app.services.ai_service import AIService

router = APIRouter(prefix="/ai", tags=["AI Engine"])
limiter = Limiter(key_func=get_remote_address)


@router.post("/generate", response_model=AIResultResponse)
@limiter.limit(settings.AI_RATE_LIMIT)
async def generate_resume(
    request: Request,
    data: GenerateResumeRequest,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await AIService(db).generate_resume(data.resume_id, user_id)


@router.post("/improve", response_model=AIResultResponse)
@limiter.limit(settings.AI_RATE_LIMIT)
async def improve_resume(
    request: Request,
    data: ImproveResumeRequest,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await AIService(db).improve_resume(data.resume_id, user_id)


@router.post("/score", response_model=AIResultResponse)
@limiter.limit(settings.AI_RATE_LIMIT)
async def score_resume(
    request: Request,
    data: ScoreResumeRequest,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await AIService(db).score_resume(data.resume_id, user_id)


@router.post("/score-public")
@limiter.limit("5/hour")
async def score_public_cv(
    request: Request,
    data: PublicScoreRequest,
):
    """Free ATS score — no account required. Rate limited to 5/hour per IP."""
    if not data.cv_text or len(data.cv_text.strip()) < 100:
        raise HTTPException(400, "Please paste at least a few lines of your CV text.")
    if len(data.cv_text) > 8000:
        raise HTTPException(400, "CV text is too long. Paste just the key sections.")
    from app.core.openai_client import get_openai_client
    from app.core.config import settings
    import json as _json
    client = get_openai_client()
    prompt = (
        "Score this CV for ATS compatibility. Be honest and specific.\n\n"
        f"CV TEXT:\n{data.cv_text[:6000]}\n\n"
        "Return ONLY valid JSON:\n"
        '{"score": <0-100>, "top_issues": ["<issue1>", "<issue2>", "<issue3>"], '
        '"keywords_missing": ["<kw1>", "<kw2>", "<kw3>"], "verdict": "<one sentence summary>"}'
    )
    try:
        resp = await client.chat.completions.create(
            model=settings.GROQ_MODEL,
            messages=[
                {"role": "system", "content": "You are an ATS expert. Return ONLY valid JSON. Be specific and honest."},
                {"role": "user", "content": prompt},
            ],
            response_format={"type": "json_object"},
            temperature=0.3,
            max_tokens=500,
        )
        return _json.loads(resp.choices[0].message.content)
    except Exception as e:
        raise HTTPException(502, f"Scoring failed: {str(e)}")


@router.post("/cover-letter", response_model=AIResultResponse)
@limiter.limit(settings.AI_RATE_LIMIT)
async def generate_cover_letter(
    request: Request,
    data: CoverLetterRequest,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await AIService(db).generate_cover_letter(
        data.resume_id, user_id, data.company_name, data.job_title
    )


@router.get("/usage")
async def get_usage(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await AIService(db).get_usage(user_id)


@router.get("/results/{resume_id}/latest", response_model=AIResultResponse | None)
async def get_latest_result(
    resume_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await AIService(db).get_latest_result(resume_id, user_id)


@router.get("/results/{resume_id}", response_model=list[AIResultResponse])
async def get_all_results(
    resume_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await AIService(db).get_all_results(resume_id, user_id)
