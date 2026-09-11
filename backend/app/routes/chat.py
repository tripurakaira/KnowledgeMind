from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.embeddings import create_embeddings
from app.services.store import vector_store
from app.services.llm import generate_answer, LLMError

router = APIRouter()


class ChatRequest(BaseModel):
    question: str


@router.post("/chat")
async def chat(request: ChatRequest):
    try:
        # Create embedding for the question
        query_embedding = create_embeddings([request.question])[0]

        # Retrieve relevant chunks (will be list of dicts)
        results = vector_store.search(query_embedding)

        # Generate answer using Gemini -> returns structured dict
        gen = generate_answer(request.question, results)

        return {
            "question": request.question,
            "answer": gen.get("answer"),
            "sources": gen.get("sources"),
            "retrieved_chunks": gen.get("retrieved_context"),
        }

    except LLMError as e:
        raise HTTPException(
            status_code=e.status_code,
            detail=str(e)
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )