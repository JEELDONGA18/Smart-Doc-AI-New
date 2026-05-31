import os
from google import genai
from google.genai.errors import APIError
from dotenv import load_dotenv

load_dotenv()

# We will initialize the client dynamically to check for API key per request
# or we can check it inside the function.
SYSTEM_PROMPT = """You are Smart Doc AI, a helpful document assistant for a company.

STRICT RULES:
1. Answer ONLY based on the provided document content below.
2. Never use external knowledge or make assumptions.
3. Never hallucinate or fabricate information.
4. If the answer is not found in the documents, respond exactly with:
   "Sorry, I can only answer questions related to uploaded company documents."
5. When citing information, mention which document it came from.
6. Keep answers clear, concise, and professional.
7. Use bullet points whenever listing items.
8. Avoid excessive blank lines.
9. Format answers in a readable structure.

DOCUMENT CONTENT:
{context}
"""


def ask_gemini(question: str, document_content: str) -> str:
    """Send a question to Gemini with document context and get a response."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return "System Error: Gemini API key is missing. Please configure it in the backend."

    try:
        client = genai.Client(api_key=api_key)
        prompt = SYSTEM_PROMPT.format(context=document_content)

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=[
                {"role": "user", "parts": [{"text": prompt}]},
                {"role": "user", "parts": [{"text": question}]},
            ],
        )
        
        answer = response.text or ""

        while "\n\n\n" in answer:
            answer = answer.replace("\n\n\n", "\n\n")

        return answer or "Sorry, I couldn't generate a response. Please try again."

    except APIError as e:
        print(f"Gemini API Error: {e}")
        error_msg = str(e).lower()
        if "429" in error_msg or "quota" in error_msg or "rate limit" in error_msg:
            return "Sorry, the AI is currently overloaded with requests (rate limit). Please try again in a moment."
        elif "api key" in error_msg or "401" in error_msg or "403" in error_msg:
            return "System Error: Invalid Gemini API key."
        return f"Sorry, there was an AI service error. Details: {e}"
    except Exception as e:
        print(f"Unexpected error calling Gemini: {e}")
        return "Sorry, an unexpected error occurred while communicating with the AI. Please try again later."
