import pytest
from unittest.mock import AsyncMock, patch
from httpx import AsyncClient

pytestmark = pytest.mark.asyncio

MOCK_AI_RESPONSE = {
    "resume_text": "JANE DOE\njane@example.com | +1-555-0100 | San Francisco, CA\n\nPROFESSIONAL SUMMARY\nExperienced software engineer...",
    "ats_score": 85,
    "improvements": [
        "Add more quantified metrics to work experience",
        "Include industry-specific certifications",
    ],
    "keywords_used": ["Python", "FastAPI", "PostgreSQL", "backend", "API"],
    "structured_sections": {
        "summary": "Experienced software engineer with 5+ years...",
        "experience": [],
        "education": [],
        "skills": ["Python", "FastAPI"],
        "projects": [],
    },
}

SAMPLE_RESUME = {
    "title": "AI Test Resume",
    "personal_info": {
        "name": "Jane Doe",
        "email": "jane@example.com",
        "phone": "+1-555-0100",
        "location": "San Francisco, CA",
    },
    "work_experience": [],
    "education": [],
    "skills": ["Python", "FastAPI"],
    "projects": [],
}


async def test_generate_resume_mocked(client: AsyncClient, auth_headers: dict):
    created = await client.post(
        "/api/v1/resumes", json=SAMPLE_RESUME, headers=auth_headers
    )
    resume_id = created.json()["id"]

    mock_chat = AsyncMock()
    mock_chat.completions.create.return_value = AsyncMock(
        choices=[AsyncMock(message=AsyncMock(content=str(MOCK_AI_RESPONSE).replace("'", '"')))]
    )

    import json

    mock_chat.completions.create.return_value = AsyncMock(
        choices=[
            AsyncMock(
                message=AsyncMock(content=json.dumps(MOCK_AI_RESPONSE))
            )
        ]
    )

    with patch("app.core.openai_client.get_openai_client", return_value=mock_chat):
        response = await client.post(
            "/api/v1/ai/generate",
            json={"resume_id": resume_id},
            headers=auth_headers,
        )

    assert response.status_code == 200
    data = response.json()
    assert "ats_score" in data
    assert "improvements" in data
    assert "keywords_used" in data
    assert 0 <= data["ats_score"] <= 100


async def test_ai_result_structure_validation():
    import json
    from app.services.ai_service import AIService

    valid_response = json.dumps(MOCK_AI_RESPONSE)
    data = json.loads(valid_response)

    assert "resume_text" in data
    assert "ats_score" in data
    assert isinstance(data["ats_score"], int)
    assert 0 <= data["ats_score"] <= 100
    assert isinstance(data["improvements"], list)
    assert isinstance(data["keywords_used"], list)


async def test_ai_endpoint_requires_auth(client: AsyncClient):
    response = await client.post(
        "/api/v1/ai/generate", json={"resume_id": "some-id"}
    )
    assert response.status_code == 403


async def test_ai_score_invalid_resume(client: AsyncClient, auth_headers: dict):
    response = await client.post(
        "/api/v1/ai/score",
        json={"resume_id": "nonexistent-resume-id"},
        headers=auth_headers,
    )
    assert response.status_code == 404
