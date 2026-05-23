from pathlib import Path
from app.core.config import settings


async def save_pdf(pdf_bytes: bytes, filename: str) -> str:
    if settings.STORAGE_TYPE == "s3":
        return await _save_to_s3(pdf_bytes, filename)
    return await _save_local(pdf_bytes, filename)


async def _save_local(pdf_bytes: bytes, filename: str) -> str:
    storage_path = Path(settings.LOCAL_STORAGE_PATH) / "pdfs"
    storage_path.mkdir(parents=True, exist_ok=True)

    file_path = storage_path / filename
    with open(file_path, "wb") as f:
        f.write(pdf_bytes)

    return f"/storage/pdfs/{filename}"


async def _save_to_s3(pdf_bytes: bytes, filename: str) -> str:
    import boto3

    s3 = boto3.client(
        "s3",
        region_name=settings.S3_REGION,
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
    )
    key = f"pdfs/{filename}"
    s3.put_object(
        Bucket=settings.S3_BUCKET,
        Key=key,
        Body=pdf_bytes,
        ContentType="application/pdf",
    )
    return f"https://{settings.S3_BUCKET}.s3.{settings.S3_REGION}.amazonaws.com/{key}"
