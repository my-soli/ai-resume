import logging
from datetime import datetime, timezone, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
from app.models.user import User
from app.core.config import settings

logger = logging.getLogger(__name__)

SUBSCRIPTION_DURATION_DAYS = 31


class SubscriptionService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def verify_google_play_purchase(
        self, user_id: str, purchase_token: str, product_id: str
    ) -> dict:
        result = await self.db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        verified = await self._verify_with_google(purchase_token, product_id)

        if verified:
            user.is_pro = True
            user.google_play_token = purchase_token
            user.subscription_expires_at = datetime.now(timezone.utc) + timedelta(
                days=SUBSCRIPTION_DURATION_DAYS
            )
            await self.db.commit()
            await self.db.refresh(user)

        return {
            "is_pro": user.is_pro,
            "subscription_expires_at": user.subscription_expires_at,
        }

    async def _verify_with_google(self, purchase_token: str, product_id: str) -> bool:
        if not settings.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON:
            # Dev mode — accept all purchases (set env var in prod)
            logger.warning(
                "GOOGLE_PLAY_SERVICE_ACCOUNT_JSON not set — skipping verification (dev mode)"
            )
            return True

        try:
            import json
            from google.oauth2 import service_account
            from googleapiclient.discovery import build

            credentials = service_account.Credentials.from_service_account_info(
                json.loads(settings.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON),
                scopes=["https://www.googleapis.com/auth/androidpublisher"],
            )
            service = build("androidpublisher", "v3", credentials=credentials)
            result = (
                service.purchases()
                .subscriptions()
                .get(
                    packageName=settings.GOOGLE_PLAY_PACKAGE_NAME,
                    subscriptionId=product_id,
                    token=purchase_token,
                )
                .execute()
            )
            # paymentState 1 = payment received
            return result.get("paymentState") == 1
        except Exception as e:
            logger.error("Google Play verification failed: %s", e)
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail="Purchase verification failed",
            )

    async def paddle_activate(self, email: str) -> None:
        result = await self.db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        if not user:
            return
        user.is_pro = True
        user.subscription_expires_at = datetime.now(timezone.utc) + timedelta(days=32)
        await self.db.commit()

    async def paddle_cancel(self, email: str) -> None:
        result = await self.db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        if not user:
            return
        user.is_pro = False
        user.subscription_expires_at = None
        await self.db.commit()

    async def get_subscription_status(self, user_id: str) -> dict:
        result = await self.db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Auto-expire if past expiry
        if (
            user.is_pro
            and user.subscription_expires_at
            and datetime.now(timezone.utc) > user.subscription_expires_at
        ):
            user.is_pro = False
            await self.db.commit()

        return {
            "is_pro": user.is_pro,
            "subscription_expires_at": user.subscription_expires_at,
        }
