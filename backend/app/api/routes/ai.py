from fastapi import APIRouter, Depends, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.core.security import get_current_user_id
from app.core.config import settings
from pydantic import BaseModel
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
