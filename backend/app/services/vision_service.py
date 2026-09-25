import base64
import json
import logging
import re
import httpx
from typing import Dict, Any, List, Optional

from app.config import (
    OPENROUTER_API_KEY,
    OPENROUTER_MODEL,
    OPENROUTER_FALLBACK_MODELS,
    OPENROUTER_BASE_URL
)
from app.prompts import SYSTEM_PROMPT, get_demo_mock_response
from app.schemas import CropAnalysisResponse
from app.services.image_preprocessor import preprocess_leaf_image

logger = logging.getLogger("cropguard.vision")

def clean_json_text(raw_text: str) -> str:
    """Removes potential markdown code fences and extraneous text from model response."""
    text = raw_text.strip()
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
    if match:
        return match.group(1).strip()
    # Try finding the first '{' and last '}'
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        return text[start:end+1].strip()
    return text

async def analyze_crop_image(
    file_bytes: bytes,
    mime_type: str,
    filename: str,
    crop_hint: Optional[str] = None
) -> CropAnalysisResponse:
    """
    Sends preprocessed crop leaf image to OpenRouter Vision Models with automatic fallback.
    Uses 2026 Plant Pathology Diagnostic Protocol for ultra-reliable diagnosis.
    """
    if not OPENROUTER_API_KEY:
        logger.warning("No OPENROUTER_API_KEY detected in environment. Returning demo mock diagnosis.")
        mock_data = get_demo_mock_response(filename)
        return CropAnalysisResponse(**mock_data)

    # 1. Preprocess & Normalize Image (Auto-orient EXIF, resize down if huge, convert to RGB)
    processed_bytes, processed_mime = preprocess_leaf_image(file_bytes)
    base64_encoded = base64.b64encode(processed_bytes).decode("utf-8")
    data_url = f"data:{processed_mime};base64,{base64_encoded}"

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://cropguard.ai",
        "X-Title": "CropGuard AI"
    }

    # 2. Build User Prompt with Optional Crop Context
    user_prompt_text = "Analyze this crop photograph following your 5-step clinical diagnostic protocol."
    if crop_hint and crop_hint.lower() not in ("auto", "auto-detect", "unknown", ""):
        user_prompt_text += f" Context: The grower notes this crop is '{crop_hint}'. Verify visual consistency and inspect for known pathogens of this host."

    # 3. Model Sequence
    models_to_try: List[str] = [OPENROUTER_MODEL]
    for fb in OPENROUTER_FALLBACK_MODELS:
        if fb not in models_to_try:
            models_to_try.append(fb)

    last_error = ""

    async with httpx.AsyncClient(timeout=40.0) as client:
        for model in models_to_try:
            logger.info(f"Attempting crop diagnosis with model: {model}")
            payload = {
                "model": model,
                "messages": [
                    {
                        "role": "system",
                        "content": SYSTEM_PROMPT
                    },
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": user_prompt_text},
                            {"type": "image_url", "image_url": {"url": data_url}}
                        ]
                    }
                ],
                "temperature": 0.1,  # Low temperature for high reproducibility and consistency
                "response_format": {"type": "json_object"}
            }

            try:
                response = await client.post(
                    f"{OPENROUTER_BASE_URL}/chat/completions",
                    headers=headers,
                    json=payload
                )

                if response.status_code == 200:
                    result = response.json()
                    choices = result.get("choices", [])
                    if not choices:
                        continue
                    message_content = choices[0]["message"].get("content", "")
                    if not message_content:
                        continue

                    cleaned_text = clean_json_text(message_content)
                    parsed_json = json.loads(cleaned_text)

                    # Ensure essential fields exist
                    if "diagnostic_reasoning" not in parsed_json:
                        parsed_json["diagnostic_reasoning"] = parsed_json.get("description", "Morphological inspection complete.")
                    if "status" not in parsed_json:
                        parsed_json["status"] = "diseased" if parsed_json.get("condition", "").lower() != "healthy" else "healthy"

                    parsed_json["model_used"] = result.get("model", model)
                    parsed_json["is_demo_mock"] = False
                    logger.info(f"Successfully received diagnosis from {model}")
                    return CropAnalysisResponse(**parsed_json)

                elif response.status_code in (429, 404, 503, 400):
                    logger.warning(f"Model {model} returned {response.status_code}, attempting next fallback: {response.text[:80]}")
                    last_error = f"{model} returned {response.status_code}"
                    continue
                else:
                    logger.warning(f"Model {model} returned {response.status_code}: {response.text[:120]}")
                    last_error = f"{model} returned {response.status_code}"
                    continue

            except json.JSONDecodeError as jde:
                logger.error(f"Failed to parse JSON from {model}: {jde}")
                continue
            except httpx.RequestError as req_err:
                logger.warning(f"Network error with {model}: {req_err}")
                last_error = str(req_err)
                continue

    # Fallback to simulation mode if all models fail
    logger.error(f"All vision models failed ({last_error}). Falling back to demo mode.")
    mock_data = get_demo_mock_response(filename)
    mock_data["description"] = f"OpenRouter models were temporarily unavailable ({last_error}). Displaying simulated agronomic diagnosis."
    mock_data["model_used"] = f"CropGuard Failover Mode ({last_error})"
    return CropAnalysisResponse(**mock_data)
