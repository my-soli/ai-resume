"""add subscription fields to users

Revision ID: 003
Revises: 002
Create Date: 2024-01-03 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "003"
down_revision: Union[str, None] = "002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("is_pro", sa.Boolean(), nullable=False, server_default="false"),
    )
    op.add_column(
        "users",
        sa.Column(
            "subscription_expires_at", sa.DateTime(timezone=True), nullable=True
        ),
    )
    op.add_column(
        "users",
        sa.Column("google_play_token", sa.Text(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("users", "google_play_token")
    op.drop_column("users", "subscription_expires_at")
    op.drop_column("users", "is_pro")
