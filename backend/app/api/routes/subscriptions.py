from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from app.db.database import get_db
from app.core.security import get_current_user_id
from app.services.subscription_service import SubscriptionService

router = APIRouter(prefix="/subscriptions", tags=["Subscriptions"])


class VerifyPurchaseRequest(BaseModel):
    purchase_token: str
    product_id: str


class SubscriptionStatusResponse(BaseModel):
    is_pro: bool
    subscription_expires_at: str | None = None


@router.post("/verify", response_model=SubscriptionStatusResponse)
async def verify_purchase(
    data: VerifyPurchaseRequest,
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    result = await SubscriptionService(db).verify_google_play_purchase(
        user_id, data.purchase_token, data.product_id
    )
    return {
        "is_pro": result["is_pro"],
        "subscription_expires_at": (
            result["subscription_expires_at"].isoformat()
            if result["subscription_expires_at"]
            else None
        ),
    }


@router.get("/status", response_model=SubscriptionStatusResponse)
async def get_status(
    user_id: str = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
):
    result = await SubscriptionService(db).get_subscription_status(user_id)
    return {
        "is_pro": result["is_pro"],
        "subscription_expires_at": (
            result["subscription_expires_at"].isoformat()
            if result["subscription_expires_at"]
            else None
        ),
    }
