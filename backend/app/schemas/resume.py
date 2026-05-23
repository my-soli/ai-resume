from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PersonalInfo(BaseModel):
    name: str
    email: str
    phone: str
    location: str
    linkedin: Optional[str] = None
    github: Optional[str] = None
    website: Optional[str] = None
    summary: Optional[str] = None


class WorkExperience(BaseModel):
    company: str
    position: str
    start_date: str
    end_date: Optional[str] = None
    current: bool = False
    description: str
    achievements: list[str] = []


class Education(BaseModel):
    institution: str
    degree: str
    field: str
    start_date: str
    end_date: Optional[str] = None
    gpa: Optional[str] = None


class Project(BaseModel):
    name: str
    description: str
    technologies: list[str] = []
    url: Optional[str] = None


class CreateResumeRequest(BaseModel):
    title: str
    personal_info: PersonalInfo
    work_experience: list[WorkExperience] = []
    education: list[Education] = []
    skills: list[str] = []
    projects: list[Project] = []
    job_description: Optional[str] = None


class UpdateResumeRequest(BaseModel):
    title: Optional[str] = None
    personal_info: Optional[PersonalInfo] = None
    work_experience: Optional[list[WorkExperience]] = None
    education: Optional[list[Education]] = None
    skills: Optional[list[str]] = None
    projects: Optional[list[Project]] = None
    job_description: Optional[str] = None


class ResumeVersionResponse(BaseModel):
    id: str
    resume_id: str
    version_number: int
    snapshot: dict
    created_at: datetime

    model_config = {"from_attributes": True}


class ResumeResponse(BaseModel):
    id: str
    user_id: str
    title: str
    personal_info: dict
    work_experience: list
    education: list
    skills: list
    projects: list
    job_description: Optional[str]
    pdf_url: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
