import uuid
from fastapi import APIRouter, Depends
from fastapi.responses import Response
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.core.security import get_current_user_id
from app.schemas.resume import (
    CreateResumeRequest,
    UpdateResumeRequest,
    ResumeResponse,
    ResumeVersionResponse,
)
from app.services.resume_service import ResumeService
from app.services.pdf_service import generate_resume_pdf
from app.services.storage_service import save_pdf

router = APIRouter(prefix="/resumes", tags=["Resumes"])


@router.post("", response_model=ResumeResponse, status_code=201)
async def create_resume(
    data: CreateResumeRequest,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await ResumeService(db).create(user_id, data)


@router.get("", response_model=list[ResumeResponse])
async def list_resumes(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await ResumeService(db).get_all(user_id)


@router.get("/{resume_id}", response_model=ResumeResponse)
async def get_resume(
    resume_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await ResumeService(db).get_by_id(resume_id, user_id)


@router.patch("/{resume_id}", response_model=ResumeResponse)
async def update_resume(
    resume_id: str,
    data: UpdateResumeRequest,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await ResumeService(db).update(resume_id, user_id, data)


@router.delete("/{resume_id}", status_code=204)
async def delete_resume(
    resume_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    await ResumeService(db).delete(resume_id, user_id)


@router.get("/{resume_id}/versions", response_model=list[ResumeVersionResponse])
async def get_versions(
    resume_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    return await ResumeService(db).get_versions(resume_id, user_id)


@router.get("/{resume_id}/download")
async def download_pdf(
    resume_id: str,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    resume = await ResumeService(db).get_by_id(resume_id, user_id)
    pdf_bytes = generate_resume_pdf(dict(resume))
    filename = f"resume_{resume_id[:8]}_{uuid.uuid4().hex[:6]}.pdf"
    await save_pdf(pdf_bytes, filename)

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"',
            "Content-Length": str(len(pdf_bytes)),
        },
    )
