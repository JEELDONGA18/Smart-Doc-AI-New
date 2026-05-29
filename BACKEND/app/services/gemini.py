import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

# Initialize Gemini client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

SYSTEM_PROMPT = """You are Smart Doc AI, a helpful document assistant for a company.

STRICT RULES:
1. Answer ONLY based on the provided document content below.
2. Never use external knowledge or make assumptions.
3. Never hallucinate or fabricate information.
4. If the answer is not found in the documents, respond exactly with:
   "Sorry, I can only answer questions related to uploaded company documents."
5. When citing information, mention which document it came from.
6. Keep answers clear, concise, and professional.

DOCUMENT CONTENT:
{context}
"""


def ask_gemini(question: str, document_content: str) -> str:
    """Send a question to Gemini with document context and get a response."""
    try:
        prompt = SYSTEM_PROMPT.format(context=document_content)

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                {"role": "user", "parts": [{"text": prompt}]},
                {"role": "user", "parts": [{"text": question}]},
            ],
        )

        return response.text or "Sorry, I couldn't generate a response. Please try again."

    except Exception as e:
        print(f"Gemini API error: {e}")
        return "Sorry, there was an error processing your request. Please try again later."
