import io
import uuid
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
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
from app.services.ai_service import AIService


def _extract_text(file_bytes: bytes, filename: str) -> str:
    name = filename.lower()
    if name.endswith(".pdf"):
        from pypdf import PdfReader
        reader = PdfReader(io.BytesIO(file_bytes))
        return "\n".join(page.extract_text() or "" for page in reader.pages).strip()
    if name.endswith((".docx", ".doc")):
        from docx import Document
        doc = Document(io.BytesIO(file_bytes))
        return "\n".join(p.text for p in doc.paragraphs).strip()
    raise HTTPException(400, "Unsupported file type. Upload a PDF or DOCX file.")

router = APIRouter(prefix="/resumes", tags=["Resumes"])


@router.post("/upload-parse")
async def upload_parse_resume(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    content = await file.read()
    if len(content) > 5 * 1024 * 1024:
        raise HTTPException(400, "File too large. Maximum 5 MB.")
    text = _extract_text(content, file.filename or "")
    if not text:
        raise HTTPException(400, "Could not extract text from file. Make sure the CV contains selectable text.")
    return await AIService(db).parse_cv_text(text)


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
