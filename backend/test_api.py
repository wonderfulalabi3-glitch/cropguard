import io
from fastapi.testclient import TestClient
from PIL import Image, ImageDraw
from app.main import app

client = TestClient(app)

def generate_valid_leaf_jpeg() -> bytes:
    img = Image.new("RGB", (200, 200), color=(240, 248, 240))
    draw = ImageDraw.Draw(img)
    # Leaf oval
    draw.ellipse([40, 20, 160, 180], fill=(46, 139, 87), outline=(34, 100, 60), width=2)
    # Lesion spot
    draw.ellipse([80, 70, 120, 110], fill=(218, 165, 32))
    draw.ellipse([90, 80, 110, 100], fill=(92, 58, 33))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}"
    data = res.json()
    print("Health response:", data)
    assert data["status"] == "healthy"

def test_analyze():
    valid_jpeg = generate_valid_leaf_jpeg()
    files = {"file": ("test_leaf.jpg", valid_jpeg, "image/jpeg")}
    
    res = client.post("/api/analyze", files=files)
    assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
    diagnosis = res.json()
    print("\n--- Diagnostic Output ---")
    print(f"Plant Detected: {diagnosis.get('is_plant')}")
    print(f"Crop Name: {diagnosis.get('crop_name')}")
    print(f"Condition: {diagnosis.get('condition')}")
    print(f"Status: {diagnosis.get('status')}")
    print(f"Confidence: {diagnosis.get('confidence')}")
    print(f"Severity: {diagnosis.get('severity')}")
    print(f"Model Used: {diagnosis.get('model_used')}")
    print(f"Is Demo Mock: {diagnosis.get('is_demo_mock')}")
    print(f"Symptoms: {diagnosis.get('visual_symptoms')}")
    print(f"Description: {diagnosis.get('description')}")
    print("--------------------------\n")
    assert diagnosis["is_plant"] is not None
    assert diagnosis["status"] in ["healthy", "diseased", "pest_damage", "invalid_image"]

if __name__ == "__main__":
    print("Testing /api/health...")
    test_health()
    print("Testing /api/analyze...")
    test_analyze()
    print("ALL API TESTS PASSED SUCCESSFULLY!")
