import logging
from typing import Optional
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from app.config import (
    CORS_ORIGINS,
    MAX_IMAGE_BYTES,
    MAX_IMAGE_SIZE_MB,
    OPENROUTER_API_KEY,
    OPENROUTER_MODEL
)
from app.schemas import CropAnalysisResponse
from app.services.vision_service import analyze_crop_image

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("cropguard.main")

app = FastAPI(
    title="CropGuard AI API",
    description="FastAPI backend powered by Vision Language Models for crop disease detection.",
    version="1.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "project": "CropGuard AI",
        "version": "1.1.0",
        "status": "operational",
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "api_key_configured": bool(OPENROUTER_API_KEY),
        "model": OPENROUTER_MODEL,
        "max_upload_size_mb": MAX_IMAGE_SIZE_MB
    }

@app.post("/api/analyze", response_model=CropAnalysisResponse)
async def analyze_image(
    file: UploadFile = File(...),
    crop_hint: Optional[str] = Form(None)
):
    """
    Accepts an uploaded crop leaf photo and analyzes it for diseases, pests, and symptoms.
    Supports optional crop_hint for enhanced diagnostic accuracy.
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type '{file.content_type}'. Please upload an image file (JPG, PNG, WebP)."
        )

    # Read image contents
    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded image file is empty."
        )

    if len(contents) > MAX_IMAGE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Image size exceeds the maximum limit of {MAX_IMAGE_SIZE_MB}MB."
        )

    try:
        diagnosis = await analyze_crop_image(
            file_bytes=contents,
            mime_type=file.content_type,
            filename=file.filename or "uploaded_leaf.jpg",
            crop_hint=crop_hint
        )
        return diagnosis
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error analyzing image: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}"
        )
