from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func
from fastapi import HTTPException, status
from app.models.resume import Resume, ResumeVersion
from app.schemas.resume import (
    CreateResumeRequest,
    UpdateResumeRequest,
    ResumeResponse,
    ResumeVersionResponse,
)


class ResumeService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(
        self, user_id: str, data: CreateResumeRequest
    ) -> ResumeResponse:
        resume = Resume(
            user_id=user_id,
            title=data.title,
            personal_info=data.personal_info.model_dump(),
            work_experience=[e.model_dump() for e in data.work_experience],
            education=[e.model_dump() for e in data.education],
            skills=data.skills,
            projects=[p.model_dump() for p in data.projects],
            job_description=data.job_description,
        )
        self.db.add(resume)
        await self.db.commit()
        await self.db.refresh(resume)
        await self._save_version(resume)
        return ResumeResponse.model_validate(resume)

    async def get_all(self, user_id: str) -> list[ResumeResponse]:
        result = await self.db.execute(
            select(Resume)
            .where(Resume.user_id == user_id)
            .order_by(Resume.updated_at.desc())
        )
        return [ResumeResponse.model_validate(r) for r in result.scalars().all()]

    async def get_by_id(self, resume_id: str, user_id: str) -> ResumeResponse:
        resume = await self._get_or_404(resume_id, user_id)
        return ResumeResponse.model_validate(resume)

    async def update(
        self, resume_id: str, user_id: str, data: UpdateResumeRequest
    ) -> ResumeResponse:
        resume = await self._get_or_404(resume_id, user_id)

        if data.title is not None:
            resume.title = data.title
        if data.personal_info is not None:
            resume.personal_info = data.personal_info.model_dump()
        if data.work_experience is not None:
            resume.work_experience = [e.model_dump() for e in data.work_experience]
        if data.education is not None:
            resume.education = [e.model_dump() for e in data.education]
        if data.skills is not None:
            resume.skills = data.skills
        if data.projects is not None:
            resume.projects = [p.model_dump() for p in data.projects]
        if data.job_description is not None:
            resume.job_description = data.job_description

        await self.db.commit()
        await self.db.refresh(resume)
        await self._save_version(resume)
        return ResumeResponse.model_validate(resume)

    async def delete(self, resume_id: str, user_id: str) -> None:
        resume = await self._get_or_404(resume_id, user_id)
        await self.db.delete(resume)
        await self.db.commit()

    async def get_versions(
        self, resume_id: str, user_id: str
    ) -> list[ResumeVersionResponse]:
        await self._get_or_404(resume_id, user_id)
        result = await self.db.execute(
            select(ResumeVersion)
            .where(ResumeVersion.resume_id == resume_id)
            .order_by(ResumeVersion.version_number.desc())
        )
        return [ResumeVersionResponse.model_validate(v) for v in result.scalars().all()]

    async def _get_or_404(self, resume_id: str, user_id: str) -> Resume:
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

    async def _save_version(self, resume: Resume) -> None:
        count_result = await self.db.execute(
            select(func.count()).where(ResumeVersion.resume_id == resume.id)
        )
        version_count = count_result.scalar() or 0

        version = ResumeVersion(
            resume_id=resume.id,
            version_number=version_count + 1,
            snapshot={
                "title": resume.title,
                "personal_info": resume.personal_info,
                "work_experience": resume.work_experience,
                "education": resume.education,
                "skills": resume.skills,
                "projects": resume.projects,
            },
        )
        self.db.add(version)
        await self.db.commit()
