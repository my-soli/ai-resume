import hashlib
import hmac
import json
import logging
from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from app.db.database import get_db
from app.core.security import get_current_user_id
from app.core.config import settings
from app.services.subscription_service import SubscriptionService

logger = logging.getLogger(__name__)

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


@router.post("/paddle-webhook")
async def paddle_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    body = await request.body()

    # Verify signature if secret is configured
    if settings.PADDLE_WEBHOOK_SECRET:
        signature = request.headers.get("Paddle-Signature", "")
        try:
            parts = dict(p.split("=", 1) for p in signature.split(";"))
            ts = parts.get("ts", "")
            h1 = parts.get("h1", "")
            signed = f"{ts}:{body.decode()}"
            expected = hmac.new(
                settings.PADDLE_WEBHOOK_SECRET.encode(),
                signed.encode(),
                hashlib.sha256,
            ).hexdigest()
            if not hmac.compare_digest(expected, h1):
                raise HTTPException(400, "Invalid Paddle signature")
        except HTTPException:
            raise
        except Exception:
            raise HTTPException(400, "Could not verify Paddle signature")

    try:
        data = json.loads(body)
    except Exception:
        raise HTTPException(400, "Invalid JSON")

    event_type = data.get("event_type", "")
    logger.info("Paddle webhook: %s", event_type)

    svc = SubscriptionService(db)

    if event_type in ("subscription.activated", "subscription.updated", "transaction.completed"):
        try:
            email = (
                data.get("data", {}).get("customer", {}).get("email")
                or data.get("data", {}).get("billing_details", {}).get("email")
            )
            if email:
                await svc.paddle_activate(email)
                logger.info("Paddle: activated Pro for %s", email)
        except Exception as e:
            logger.error("Paddle activate error: %s", e)

    elif event_type in ("subscription.canceled", "subscription.paused"):
        try:
            email = data.get("data", {}).get("customer", {}).get("email")
            if email:
                await svc.paddle_cancel(email)
                logger.info("Paddle: cancelled Pro for %s", email)
        except Exception as e:
            logger.error("Paddle cancel error: %s", e)

    return {"ok": True}


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
