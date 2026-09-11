from google import genai
from app.config import GEMINI_API_KEY

print("Key loaded:", GEMINI_API_KEY is not None)

client = genai.Client(api_key=GEMINI_API_KEY)

print("Client created")

try:
    models = client.models.list()

    print("Models object:", models)

    for model in models:
        print(model.name)

except Exception as e:
    print("ERROR:", e)