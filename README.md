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
## Application Screenshots

### Dashboard
![KnowledgeMind Dashboard]
<img width="1620" height="885" alt="01-dashboard png" src="https://github.com/user-attachments/assets/eeb0285b-34e9-4c5c-918c-494e97feb899" />


### Document Processing and Indexing
![Document Indexing]
<img width="717" height="832" alt="02-document-indexing png" src="https://github.com/user-attachments/assets/6bd99112-fa3d-421c-85ec-ade34c6f47b5" />


### AI-Powered Question Answering
![Question Answering]
<img width="1425" height="638" alt="03-question-answering png" src="https://github.com/user-attachments/assets/f9468cf8-7d39-4ba5-b02e-137856701f4e" />


### FastAPI Backend Documentation
![FastAPI Documentation]
<img width="1863" height="891" alt="04-api-documentation png" src="https://github.com/user-attachments/assets/ce9f4853-1c36-4eb1-a074-1f0a2d3d45ba" />


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
