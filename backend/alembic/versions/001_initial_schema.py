"""initial schema

Revision ID: 001
Revises:
Create Date: 2024-01-01 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("email", sa.String(255), nullable=False, unique=True),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("NOW()"),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("NOW()"),
        ),
    )
    op.create_index("ix_users_email", "users", ["email"])

    op.create_table(
        "resumes",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column(
            "user_id",
            sa.String(36),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("personal_info", sa.JSON(), nullable=False, server_default="{}"),
        sa.Column("work_experience", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("education", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("skills", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("projects", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("job_description", sa.Text(), nullable=True),
        sa.Column("pdf_url", sa.String(500), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("NOW()"),
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("NOW()"),
        ),
    )
    op.create_index("ix_resumes_user_id", "resumes", ["user_id"])

    op.create_table(
        "resume_versions",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column(
            "resume_id",
            sa.String(36),
            sa.ForeignKey("resumes.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("version_number", sa.Integer(), nullable=False),
        sa.Column("snapshot", sa.JSON(), nullable=False, server_default="{}"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("NOW()"),
        ),
    )
    op.create_index("ix_resume_versions_resume_id", "resume_versions", ["resume_id"])

    op.create_table(
        "ai_results",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column(
            "resume_id",
            sa.String(36),
            sa.ForeignKey("resumes.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("operation", sa.String(50), nullable=False),
        sa.Column("resume_text", sa.Text(), nullable=False),
        sa.Column("ats_score", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("improvements", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("keywords_used", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("structured_data", sa.JSON(), nullable=False, server_default="{}"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("NOW()"),
        ),
    )
    op.create_index("ix_ai_results_resume_id", "ai_results", ["resume_id"])


def downgrade() -> None:
    op.drop_table("ai_results")
    op.drop_table("resume_versions")
    op.drop_table("resumes")
    op.drop_table("users")
