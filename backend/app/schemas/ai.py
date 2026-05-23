from pydantic import BaseModel
from datetime import datetime


class AIResultResponse(BaseModel):
    id: str
    resume_id: str
    operation: str
    resume_text: str
    ats_score: int
    improvements: list[str]
    keywords_used: list[str]
    structured_data: dict
    created_at: datetime

    model_config = {"from_attributes": True}


class GenerateResumeRequest(BaseModel):
    resume_id: str


class ImproveResumeRequest(BaseModel):
    resume_id: str


class ScoreResumeRequest(BaseModel):
    resume_id: str
