# CropGuard AI — React & FastAPI Edition

AI-Based Crop Disease Detection System using Vision Language Models (VLMs) via OpenRouter.

---

## 🌟 Architecture Overview

```
CropGuard_AI_Stage1/
├── backend/                  # Python FastAPI Backend
│   ├── app/
│   │   ├── main.py           # FastAPI entry point, CORS & endpoints
│   │   ├── config.py         # Environment configuration
│   │   ├── schemas.py        # Pydantic schemas (typed responses)
│   │   ├── prompts.py        # Agronomy system prompt & JSON schema
│   │   └── services/
│   │       └── vision_service.py # OpenRouter Vision API integration
│   ├── .env                  # OpenRouter API key & model settings
│   ├── requirements.txt      # Python dependencies
│   └── test_api.py           # API integration test suite
│
├── frontend/                 # Modern React (Vite) Application
│   ├── src/
│   │   ├── components/       # Navbar, DropZone, LoadingScanner, AnalysisResult
│   │   ├── pages/            # HomePage, DetectPage, AboutPage
│   │   ├── services/api.js   # Client API communication
│   │   ├── App.jsx           # Main application shell & routing
│   │   └── index.css         # Modernized agricultural UI design system
│   ├── package.json
│   └── vite.config.js        # Vite config with backend proxy
│
└── crop_disease_detection_stage1/ # Original Stage 1 static HTML/JS prototype (preserved)
```

---

## 🚀 Quick Start Guide

### 1. Configure OpenRouter API Key (Optional for Live Inference)

In `backend/.env`, paste your OpenRouter key:
```env
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxx
OPENROUTER_MODEL=google/gemini-2.0-flash-001
MAX_IMAGE_SIZE_MB=10
```

> **Note:** If no API key is provided, CropGuard operates in **Demo Mode**, returning high-fidelity simulated diagnostic reports so you can test the full UI/UX and API pipeline immediately.

---

### 2. Start the FastAPI Backend

Open a terminal:
```powershell
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8001
```
Backend API will be running at: `http://localhost:8001`  
Interactive Swagger API docs: `http://localhost:8001/docs`

---

### 3. Start the React Frontend

Open a second terminal:
```powershell
cd frontend
npm run dev
```
Frontend will be running at: `http://localhost:5173`

---

## 🧪 Testing the API

Run the automated integration test:
```powershell
cd backend
.\.venv\Scripts\python test_api.py
```

---

## 🌾 Features

- **Drag-and-Drop & Mobile Camera**: Upload leaf photos directly from your device or take live photos with a camera.
- **Built-in Quick Test Samples**: Click pre-loaded samples (Early Blight, Healthy Leaf, Non-Plant Object) for instant testing without finding images.
- **High-Tech Scanner UI**: Visual laser scanning animation while AI processes the leaf.
- **Comprehensive Clinical Report**:
  - Identified Crop & Pathological Condition
  - Severity Rating (*None*, *Mild*, *Moderate*, *Severe*)
  - Confidence Score Meter
  - Specific Visual Symptoms Observed
  - 3-Tier Treatment Plan:
    - 🌿 **Organic & Cultural Management**
    - 🧪 **Chemical / Fungicidal Control**
    - 🛡️ **Long-Term Prevention**
- **Non-Plant Detection**: Automatically rejects non-leaf images (shoes, cars, blurred photos) with helpful guidance.
