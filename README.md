# KnowledgeMind

AI powered document assistant (RAG) — backend (FastAPI) + frontend (React + Vite).

Quick start

1. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1  # PowerShell
python -m pip install -r requirements.txt
# ensure backend/.env has GEMINI_API_KEY and GEMINI_MODEL
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

2. Frontend

```bash
cd frontend
npm install
npm run dev
# open http://localhost:5173
```

Repository

To push to GitHub:

```bash
git remote add origin git@github.com:tripurakaira/KnowledgeMind.git
git branch -M main
git push -u origin main
```

Or create the repo using `gh` CLI:

```bash
gh repo create tripurakaira/KnowledgeMind --public --source=. --remote=origin
git push -u origin main
```
