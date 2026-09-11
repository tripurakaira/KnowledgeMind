import time

from google import genai
from google.genai.errors import ClientError, ServerError

from app.config import GEMINI_API_KEY, GEMINI_MODEL


client = genai.Client(api_key=GEMINI_API_KEY)


class LLMError(Exception):
    def __init__(self, message: str, status_code: int = 502):
        super().__init__(message)
        self.status_code = status_code


def generate_answer(question: str, context_chunks: list[dict]) -> dict:
    """
    Generate an answer and return structured output with sources and retrieved context.

    Returns:
      {
        "answer": str,
        "sources": [page_numbers],
        "retrieved_context": [ {"page": n, "text": "..."}, ... ]
      }
    """

    if context_chunks:
        # Build a context string including page markers for the LLM
        context_pieces = [f"Page {c.get('page')}: {c.get('text')}" for c in context_chunks]
        context = "\n\n".join(context_pieces)
    else:
        context = "No documents have been uploaded yet."

    prompt = f"""
You are KnowledgeMind AI.

Answer the question using ONLY the context below. After your answer, include a short "Sources:" line listing page numbers used.

Context:
{context}

Question:
{question}

Answer:
"""

    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt,
            )

            text = response.text.strip()

            # Derive sources and retrieved context from context_chunks
            sources = sorted({c.get('page') for c in context_chunks}) if context_chunks else []
            retrieved = [{"page": c.get('page'), "text": c.get('text')} for c in context_chunks]

            return {
                "answer": text,
                "sources": sources,
                "retrieved_context": retrieved,
            }

        except Exception as e:
            error = str(e)
            print(error)

            if "503" in error:
                if attempt < 2:
                    time.sleep(2)
                    continue
                raise LLMError(
                    "Gemini servers are busy. Please try again in a few minutes.",
                    status_code=503,
                )

            if "429" in error:
                raise LLMError(
                    "Gemini quota exceeded.",
                    status_code=429,
                )

            if "404" in error:
                raise LLMError(
                    "Invalid Gemini model.",
                    status_code=404,
                )

            raise LLMError(error, status_code=500)