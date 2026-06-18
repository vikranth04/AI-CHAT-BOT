from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.services.llm_service import generate_response
from app.services.classifier import classify_message
from app.services.prompt_builder import build_prompt
from app.services.chatbot import process_message

app = FastAPI(title="LingoLift API", description="AI language partner backend service", version="1.0.0")

# Setup CORS policy rules for Frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    """
    Health check home endpoint.
    """
    return {
        "message": "LingoLift API Running",
        "status": "healthy"
    }

@app.get("/chat")
def chat(message: str):
    """
    Main communication endpoint that processes natural language chat messages.
    """
    return process_message(message)

@app.get("/test-classifier")
def test_classifier(message: str):
    """
    Utility debug route to test category output classification.
    """
    feature = classify_message(message)
    return {
        "feature": feature
    }

@app.get("/test-gemini")
def test_gemini():
    """
    Utility debug route to test direct Groq/Gemini response generation.
    """
    response = generate_response("Say hello to Vikranth")
    return {
        "response": response
    }

@app.get("/test-prompt")
def test_prompt(message: str):
    """
    Utility debug route to test assembled system prompts.
    """
    feature = classify_message(message)
    prompt = build_prompt(feature, message)
    return {
        "feature": feature,
        "prompt": prompt
    }
