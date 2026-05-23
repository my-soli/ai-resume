from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.user import UserResponse, UpdateProfileRequest, ChangePasswordRequest
from app.core.security import hash_password, verify_password


class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user(self, user_id: str) -> UserResponse:
        user = await self._get_or_404(user_id)
        return UserResponse.model_validate(user)

    async def update_profile(
        self, user_id: str, data: UpdateProfileRequest
    ) -> UserResponse:
        user = await self._get_or_404(user_id)

        if data.full_name is not None:
            user.full_name = data.full_name.strip()

        await self.db.commit()
        await self.db.refresh(user)
        return UserResponse.model_validate(user)

    async def change_password(
        self, user_id: str, data: ChangePasswordRequest
    ) -> None:
        user = await self._get_or_404(user_id)

        if not verify_password(data.current_password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect",
            )

        if len(data.new_password) < 8:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="New password must be at least 8 characters",
            )

        user.hashed_password = hash_password(data.new_password)
        await self.db.commit()

    async def _get_or_404(self, user_id: str) -> User:
        result = await self.db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )
        return user
