import uuid
from datetime import datetime, timezone
from sqlalchemy import String, DateTime, ForeignKey, JSON, Integer, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.database import Base


class AIResult(Base):
    __tablename__ = "ai_results"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    resume_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("resumes.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    operation: Mapped[str] = mapped_column(
        String(50), nullable=False
    )  # generate | improve | score
    resume_text: Mapped[str] = mapped_column(Text, nullable=False)
    ats_score: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    improvements: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    keywords_used: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    structured_data: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    resume: Mapped["Resume"] = relationship("Resume", back_populates="ai_results")
