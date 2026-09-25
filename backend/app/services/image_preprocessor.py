import io
import logging
from PIL import Image, ImageOps

logger = logging.getLogger("cropguard.preprocessor")

MAX_DIMENSION = 1280  # Optimal resolution for vision language models

def preprocess_leaf_image(image_bytes: bytes) -> tuple[bytes, str]:
    """
    Standardizes and optimizes uploaded crop leaf photos:
    1. Reads image bytes with Pillow
    2. Auto-rotates using EXIF orientation tags (critical for mobile camera uploads)
    3. Converts image mode to clean 24-bit RGB (stripping alpha channels or CMYK)
    4. Resizes to max 1280px maintaining aspect ratio with Lanczos resampling
    5. Re-encodes to high-quality JPEG
    Returns (optimized_bytes, mime_type)
    """
    try:
        with Image.open(io.BytesIO(image_bytes)) as img:
            # 1. Auto-orient based on EXIF tag (phone cameras)
            try:
                img = ImageOps.exif_transpose(img)
            except Exception as e:
                logger.debug(f"EXIF transpose skipped: {e}")

            # 2. Convert to RGB
            if img.mode != "RGB":
                img = img.convert("RGB")

            # 3. Resize if larger than MAX_DIMENSION
            width, height = img.size
            if max(width, height) > MAX_DIMENSION:
                scale = MAX_DIMENSION / float(max(width, height))
                new_width = int(width * scale)
                new_height = int(height * scale)
                img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
                logger.info(f"Image resized from ({width}x{height}) to ({new_width}x{new_height}) for optimal vision processing")

            # 4. Save to optimized JPEG buffer
            out_buf = io.BytesIO()
            img.save(out_buf, format="JPEG", quality=90, optimize=True)
            return out_buf.getvalue(), "image/jpeg"

    except Exception as e:
        logger.warning(f"Image preprocessing fallback due to error: {e}. Using raw bytes.")
        return image_bytes, "image/jpeg"
