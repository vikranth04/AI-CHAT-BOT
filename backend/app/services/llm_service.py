from groq import Groq
from app.config.config import GROQ_API_KEY

# Initialize the Groq client
client = Groq(api_key=GROQ_API_KEY)

# Llama 3.3 70B model chosen for high-performance versatile language classification & replies
MODEL_NAME = "llama-3.3-70b-versatile"

def generate_response(prompt: str) -> str:
    """
    Sends a constructed prompt query to Groq LLM service.
    Handles API errors safely and returns details as a message string.
    """
    try:
        completion = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=1024
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"Error: {str(e)}"
