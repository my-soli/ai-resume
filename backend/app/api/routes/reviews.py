from fastapi import APIRouter, Request
from pydantic import BaseModel, Field
from slowapi import Limiter
from slowapi.util import get_remote_address
from app.services.email_service import send_review_notification

router = APIRouter(prefix="/reviews", tags=["Reviews"])
limiter = Limiter(key_func=get_remote_address)


class ReviewRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=80)
    role: str = Field(..., min_length=2, max_length=80)
    city: str = Field(..., min_length=2, max_length=60)
    rating: int = Field(..., ge=1, le=5)
    review: str = Field(..., min_length=20, max_length=1000)


@router.post("")
@limiter.limit("3/hour")
async def submit_review(request: Request, data: ReviewRequest):
    send_review_notification(data.name, data.role, data.city, data.rating, data.review)
    return {"message": "Thank you for your review!"}
