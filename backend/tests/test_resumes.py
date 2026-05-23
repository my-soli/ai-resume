import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.asyncio

SAMPLE_RESUME = {
    "title": "Software Engineer Resume",
    "personal_info": {
        "name": "Jane Doe",
        "email": "jane@example.com",
        "phone": "+1-555-0100",
        "location": "San Francisco, CA",
        "linkedin": "linkedin.com/in/janedoe",
        "github": "github.com/janedoe",
        "summary": "Experienced software engineer with 5 years building scalable systems.",
    },
    "work_experience": [
        {
            "company": "Tech Corp",
            "position": "Senior Software Engineer",
            "start_date": "2021-01",
            "end_date": None,
            "current": True,
            "description": "Led backend development for core platform.",
            "achievements": [
                "Reduced API latency by 40%",
                "Mentored team of 4 junior engineers",
            ],
        }
    ],
    "education": [
        {
            "institution": "State University",
            "degree": "Bachelor of Science",
            "field": "Computer Science",
            "start_date": "2015-09",
            "end_date": "2019-05",
            "gpa": "3.8",
        }
    ],
    "skills": ["Python", "FastAPI", "PostgreSQL", "Docker", "AWS", "React"],
    "projects": [
        {
            "name": "Open Source CLI Tool",
            "description": "Built a developer productivity tool with 500+ GitHub stars.",
            "technologies": ["Python", "Click"],
            "url": "github.com/janedoe/cli-tool",
        }
    ],
    "job_description": "We are looking for a backend engineer proficient in Python and PostgreSQL.",
}


async def test_create_resume(client: AsyncClient, auth_headers: dict):
    response = await client.post(
        "/api/v1/resumes", json=SAMPLE_RESUME, headers=auth_headers
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == SAMPLE_RESUME["title"]
    assert "id" in data
    return data["id"]


async def test_list_resumes(client: AsyncClient, auth_headers: dict):
    await client.post("/api/v1/resumes", json=SAMPLE_RESUME, headers=auth_headers)
    response = await client.get("/api/v1/resumes", headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) >= 1


async def test_get_resume_by_id(client: AsyncClient, auth_headers: dict):
    created = await client.post(
        "/api/v1/resumes", json=SAMPLE_RESUME, headers=auth_headers
    )
    resume_id = created.json()["id"]
    response = await client.get(f"/api/v1/resumes/{resume_id}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["id"] == resume_id


async def test_update_resume(client: AsyncClient, auth_headers: dict):
    created = await client.post(
        "/api/v1/resumes", json=SAMPLE_RESUME, headers=auth_headers
    )
    resume_id = created.json()["id"]
    response = await client.patch(
        f"/api/v1/resumes/{resume_id}",
        json={"title": "Updated Title"},
        headers=auth_headers,
    )
    assert response.status_code == 200
    assert response.json()["title"] == "Updated Title"


async def test_delete_resume(client: AsyncClient, auth_headers: dict):
    created = await client.post(
        "/api/v1/resumes", json=SAMPLE_RESUME, headers=auth_headers
    )
    resume_id = created.json()["id"]
    delete_response = await client.delete(
        f"/api/v1/resumes/{resume_id}", headers=auth_headers
    )
    assert delete_response.status_code == 204
    get_response = await client.get(
        f"/api/v1/resumes/{resume_id}", headers=auth_headers
    )
    assert get_response.status_code == 404


async def test_get_resume_versions(client: AsyncClient, auth_headers: dict):
    created = await client.post(
        "/api/v1/resumes", json=SAMPLE_RESUME, headers=auth_headers
    )
    resume_id = created.json()["id"]
    await client.patch(
        f"/api/v1/resumes/{resume_id}",
        json={"title": "Version 2"},
        headers=auth_headers,
    )
    response = await client.get(
        f"/api/v1/resumes/{resume_id}/versions", headers=auth_headers
    )
    assert response.status_code == 200
    versions = response.json()
    assert len(versions) >= 2


async def test_cannot_access_other_users_resume(client: AsyncClient):
    reg = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "other@example.com",
            "password": "password123",
            "full_name": "Other User",
        },
    )
    other_token = reg.json()["access_token"]
    other_headers = {"Authorization": f"Bearer {other_token}"}

    created = await client.post(
        "/api/v1/resumes",
        json=SAMPLE_RESUME,
        headers=other_headers,
    )
    resume_id = created.json()["id"]

    reg2 = await client.post(
        "/api/v1/auth/register",
        json={
            "email": "attacker@example.com",
            "password": "password123",
            "full_name": "Attacker",
        },
    )
    attacker_headers = {"Authorization": f"Bearer {reg2.json()['access_token']}"}

    response = await client.get(
        f"/api/v1/resumes/{resume_id}", headers=attacker_headers
    )
    assert response.status_code == 404
