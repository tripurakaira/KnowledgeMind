import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash-lite")

print("Gemini key loaded:", GEMINI_API_KEY is not None)
print("Key prefix:", GEMINI_API_KEY[:5] if GEMINI_API_KEY else "Missing")
print("Model:", GEMINI_MODEL)
