import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from backend root or app directory
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "").strip()
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "google/gemini-2.5-flash-lite").strip()
fallback_env = os.getenv("OPENROUTER_FALLBACK_MODELS", "google/gemma-4-31b-it:free,google/gemini-2.5-flash-lite,qwen/qwen3.8-27b:free")
OPENROUTER_FALLBACK_MODELS = [m.strip() for m in fallback_env.split(",") if m.strip()]
OPENROUTER_BASE_URL = os.getenv("OPENROUTER_BASE_URL", "https://openrouter.ai/api/v1").strip()

MAX_IMAGE_SIZE_MB = int(os.getenv("MAX_IMAGE_SIZE_MB", "10"))
MAX_IMAGE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024

CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"  # Allow all during local dev for seamless testing
]
