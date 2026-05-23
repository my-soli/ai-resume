# Resume AI — Full-Stack SaaS App

AI-powered resume builder with FastAPI backend, Flutter mobile app, PostgreSQL, and OpenAI integration.

---

## Architecture

```
ai-resume/
├── backend/          # FastAPI + PostgreSQL + OpenAI
│   ├── app/
│   │   ├── core/     # config, security, openai client
│   │   ├── models/   # SQLAlchemy ORM models
│   │   ├── schemas/  # Pydantic request/response schemas
│   │   ├── services/ # Business logic layer
│   │   ├── api/      # FastAPI route handlers
│   │   └── db/       # Database session management
│   ├── alembic/      # Database migrations
│   └── tests/        # pytest test suite
├── flutter_app/      # Flutter mobile app (Riverpod + GoRouter)
│   └── lib/
│       ├── core/          # theme, router, constants
│       ├── data/          # models, repositories
│       ├── presentation/  # screens, widgets, state providers
│       └── services/      # API client (Dio + JWT refresh)
└── docker-compose.yml
```

---

## Quick Start (Docker)

### 1. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and set:
```
JWT_SECRET_KEY=<generate with: python -c "import secrets; print(secrets.token_hex(32))">
OPENAI_API_KEY=sk-your-key-here
```

### 2. Start with Docker Compose

```bash
docker-compose up --build
```

This starts:
- **PostgreSQL** on port 5432
- **FastAPI backend** on port 8000 (with auto migrations)

API docs: http://localhost:8000/docs

### 3. Run Flutter app

```bash
cd flutter_app
flutter pub get
flutter run
```

> For Android emulator: base URL is `http://10.0.2.2:8000/api/v1` (already set)  
> For iOS simulator: change to `http://localhost:8000/api/v1` in `lib/core/constants/app_constants.dart`

---

## Running Backend Locally (without Docker)

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # fill in your values

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload --port 8000
```

---

## Running Tests

```bash
cd backend
pip install -r requirements.txt
pytest -v
```

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/refresh` | Refresh access token |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users/me` | Get current profile |
| PATCH | `/api/v1/users/me` | Update profile |
| POST | `/api/v1/users/me/change-password` | Change password |

### Resumes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/resumes` | Create resume |
| GET | `/api/v1/resumes` | List all resumes |
| GET | `/api/v1/resumes/{id}` | Get resume |
| PATCH | `/api/v1/resumes/{id}` | Update resume |
| DELETE | `/api/v1/resumes/{id}` | Delete resume |
| GET | `/api/v1/resumes/{id}/versions` | Version history |
| GET | `/api/v1/resumes/{id}/download` | Download as PDF |

### AI Engine
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/ai/generate` | Generate full resume |
| POST | `/api/v1/ai/improve` | Improve existing resume |
| POST | `/api/v1/ai/score` | Score + ATS analysis |
| GET | `/api/v1/ai/results/{id}/latest` | Latest AI result |
| GET | `/api/v1/ai/results/{id}` | All AI results |

---

## AI Response Format

```json
{
  "resume_text": "Complete formatted resume as plain text",
  "ats_score": 85,
  "improvements": [
    "Add quantified metrics to experience bullets",
    "Include more Python/FastAPI keywords"
  ],
  "keywords_used": ["Python", "FastAPI", "PostgreSQL"],
  "structured_sections": {
    "summary": "...",
    "experience": [],
    "education": [],
    "skills": [],
    "projects": []
  }
}
```

---

## Database Schema

```sql
users           — id, email, hashed_password, full_name, is_active, created_at
resumes         — id, user_id, title, personal_info (JSON), work_experience (JSON),
                  education (JSON), skills (JSON), projects (JSON), job_description,
                  pdf_url, created_at, updated_at
resume_versions — id, resume_id, version_number, snapshot (JSON), created_at
ai_results      — id, resume_id, operation, resume_text, ats_score, improvements (JSON),
                  keywords_used (JSON), structured_data (JSON), created_at
```

---

## S3 Storage (Production)

Set in `.env`:
```
STORAGE_TYPE=s3
S3_BUCKET=your-bucket
S3_REGION=us-east-1
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

---

## Deployment (Render / Railway)

1. Push to GitHub
2. Create a new Web Service pointing to `backend/`
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add all environment variables from `.env.example`
6. Add a PostgreSQL database and set `DATABASE_URL`

---

## Flutter App Screens

1. **Splash** — Auto-detects auth state
2. **Login / Register** — JWT auth
3. **Dashboard** — Resume list with cards
4. **Resume Builder** — 5-step form (personal, experience, education, skills, projects)
5. **Resume Detail** — View all resume data + download PDF
6. **Resume Editor** — Edit personal info
7. **AI Result** — Generate / Improve / Score with ATS gauge
