import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings

logger = logging.getLogger(__name__)


ADMIN_EMAIL = "ronoshalin@gmail.com"


def send_review_notification(name: str, role: str, city: str, rating: int, review: str) -> None:
    subject = f"⭐ New review from {name} ({rating}/5)"
    stars = "★" * rating + "☆" * (5 - rating)
    body_html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
      <h2 style="color: #6366F1;">AI CV Builder — New Review</h2>
      <div style="font-size: 24px; margin: 8px 0; color: #F59E0B;">{stars}</div>
      <p style="font-size: 16px; color: #111827; font-style: italic;">&quot;{review}&quot;</p>
      <p style="color: #6B7280;">— <strong>{name}</strong>, {role} · {city}</p>
      <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 16px 0;" />
      <p style="font-size: 12px; color: #9CA3AF;">Add this review to your testimonials at aicvbuilder.co.ke</p>
    </div>
    """
    body_plain = f'New review ({rating}/5) from {name}, {role}, {city}:\n\n"{review}"'

    if not settings.SMTP_HOST:
        logger.info("New review from %s (%d/5): %s", name, rating, review)
        return

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = settings.SMTP_FROM
        msg["To"] = ADMIN_EMAIL
        msg.attach(MIMEText(body_plain, "plain"))
        msg.attach(MIMEText(body_html, "html"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.ehlo()
            if settings.SMTP_TLS:
                server.starttls()
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_FROM, ADMIN_EMAIL, msg.as_string())
    except Exception as e:
        logger.error("Failed to send review notification: %s", e)


def send_password_reset_email(to_email: str, reset_code: str, full_name: str) -> None:
    subject = "Reset your Resume AI password"
    body_html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #6366F1;">Resume AI</h2>
      <p>Hi {full_name},</p>
      <p>You requested a password reset. Use the code below in the app:</p>
      <div style="background: #F3F4F6; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0;">
        <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #6366F1;">{reset_code}</span>
      </div>
      <p style="color: #6B7280; font-size: 14px;">This code expires in 15 minutes. If you didn't request this, ignore this email.</p>
    </div>
    """
    body_plain = f"Your Resume AI password reset code is: {reset_code}\n\nExpires in 15 minutes."

    if not settings.SMTP_HOST:
        logger.warning(
            "SMTP not configured. Password reset code for %s: %s", to_email, reset_code
        )
        return

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = settings.SMTP_FROM
        msg["To"] = to_email
        msg.attach(MIMEText(body_plain, "plain"))
        msg.attach(MIMEText(body_html, "html"))

        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.ehlo()
            if settings.SMTP_TLS:
                server.starttls()
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.SMTP_FROM, to_email, msg.as_string())
    except Exception as e:
        logger.error("Failed to send reset email to %s: %s", to_email, e)
        raise
