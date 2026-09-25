# CropGuard AI — Production Deployment Guide

This guide covers everything needed to push your code to GitHub and deploy both the FastAPI Backend and React Frontend to **Render** and/or **Vercel**.

---

## 1. Resolving the GitHub Push (403 Permission Error)

When pushing to `https://github.com/wonderfulalabi3-glitch/cropguard.git`, GitHub reported:
> `remote: Permission to wonderfulalabi3-glitch/cropguard.git denied to Wonderfulezekiel.`
> `fatal: unable to access ... The requested URL returned error: 403`

This occurs because Windows Credential Manager has cached credentials for GitHub account **`Wonderfulezekiel`**, but the repository belongs to **`wonderfulalabi3-glitch`**.

Choose any **ONE** of the following 3 solutions:

### Solution A: Add Collaborator on GitHub (Easiest & Fastest)
1. Go to your repo on GitHub: [https://github.com/wonderfulalabi3-glitch/cropguard/settings/access](https://github.com/wonderfulalabi3-glitch/cropguard/settings/access)
2. Click **"Add people"**.
3. Search for **`Wonderfulezekiel`** and invite them with **Write** or **Admin** access.
4. Check your email or GitHub notifications for `Wonderfulezekiel` to accept the invite.
5. In your terminal, run:
   ```powershell
   git push -u origin main
   ```

### Solution B: Push Using a GitHub Personal Access Token (PAT)
1. Go to: [https://github.com/settings/tokens](https://github.com/settings/tokens) (logged into `wonderfulalabi3-glitch`).
2. Generate a new token (Classic) with the **`repo`** scope checked.
3. Push using your token in the URL:
   ```powershell
   git push https://<YOUR_GITHUB_TOKEN>@github.com/wonderfulalabi3-glitch/cropguard.git main
   ```

### Solution C: Update Windows Credential Manager
1. In the Windows Start menu, search for **Credential Manager**.
2. Click **Windows Credentials**.
3. Look under "Generic Credentials" for **`git:https://github.com`**.
4. Click **Edit** and update the username/password to your `wonderfulalabi3-glitch` credentials or a Personal Access Token.
5. Run:
   ```powershell
   git push -u origin main
   ```

---

## 2. Deploying on Render

We have provided a pre-configured [**`render.yaml`**](file:///c:/Users/hp/Downloads/CropGuard_AI_Stage1/render.yaml) blueprint file that can automatically spin up both services with one click.

### Option 1: Automatic Blueprint (Recommended)
1. Log in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** > **Blueprint**.
3. Connect your GitHub repository: `wonderfulalabi3-glitch/cropguard`.
4. Render will parse `render.yaml` and configure:
   * **`cropguard-backend`** (Python Web Service)
   * **`cropguard-frontend`** (Static Site)
5. Under Environment Variables for `cropguard-backend`, set:
   * **`OPENROUTER_API_KEY`**: `your-openrouter-api-key`
6. Click **Apply**.
7. Once the backend finishes building, copy its URL (e.g. `https://cropguard-backend.onrender.com`).
8. Go to `cropguard-frontend` > **Environment** > add:
   * **`VITE_API_URL`**: `https://cropguard-backend.onrender.com`
9. Trigger a redeploy of the frontend.

---

### Option 2: Manual Setup on Render

#### Step A: Deploy Backend (Web Service)
1. Go to [Render Dashboard](https://dashboard.render.com) > **New +** > **Web Service**.
2. Select your repository `wonderfulalabi3-glitch/cropguard`.
3. Configure the following fields:
   * **Name**: `cropguard-backend`
   * **Root Directory**: `backend`
   * **Runtime**: `Python 3`
   * **Build Command**: `pip install -r requirements.txt`
   * **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   * **Instance Type**: `Free`
4. Expand **Advanced** > **Environment Variables** and add:
   | Key | Value |
   | :--- | :--- |
   | `OPENROUTER_API_KEY` | `sk-or-v1-...` (Your OpenRouter Key) |
   | `OPENROUTER_MODEL` | `google/gemini-2.5-flash-lite` |
   | `PYTHON_VERSION` | `3.11.10` |
   | `MAX_IMAGE_SIZE_MB` | `10` |
5. Click **Create Web Service**.
6. When deployment finishes, copy your live backend URL: `https://cropguard-backend.onrender.com`.

---

#### Step B: Deploy Frontend (Static Site on Render)
1. Go to [Render Dashboard](https://dashboard.render.com) > **New +** > **Static Site**.
2. Select the repository `wonderfulalabi3-glitch/cropguard`.
3. Configure:
   * **Name**: `cropguard-frontend`
   * **Root Directory**: `frontend`
   * **Build Command**: `npm install && npm run build`
   * **Publish Directory**: `dist`
4. Expand **Environment Variables** and add:
   | Key | Value |
   | :--- | :--- |
   | `VITE_API_URL` | `https://cropguard-backend.onrender.com` (Your Render backend URL from Step A) |
5. Go to **Redirects/Rewrites** and add:
   * **Type**: `Rewrite`
   * **Source**: `/*`
   * **Destination**: `/index.html`
6. Click **Create Static Site**.

---

## 3. Alternative: Deploying Frontend to Vercel

If you prefer Vercel for your frontend:
1. Log in to [Vercel Dashboard](https://vercel.com) > **Add New...** > **Project**.
2. Select `wonderfulalabi3-glitch/cropguard`.
3. Under **Project Settings**:
   * **Framework Preset**: `Vite`
   * **Root Directory**: Click edit and select `frontend`.
4. Under **Environment Variables**:
   * **`VITE_API_URL`**: `https://cropguard-backend.onrender.com` (Your Render backend URL)
5. Click **Deploy**.
*(Note: `frontend/vercel.json` is already configured in the repo to handle client-side routing).*

---

## 4. Production Checklist (All Verified)

* [x] **Secret Keys Protected**: `backend/.env` is strictly in `.gitignore` and not tracked in git.
* [x] **Dependencies Locked**: `backend/requirements.txt` includes `fastapi`, `uvicorn[standard]`, `httpx`, `pydantic`, `python-multipart`, `python-dotenv`, and `pillow`.
* [x] **CORS Support**: `backend/app/main.py` permits requests from all origins (`*`) and custom production frontend domains.
* [x] **Image Preprocessing**: Auto-orienting EXIF, downscaling large phone images, RGB normalization with Pillow.
* [x] **Dynamic Routing**: `frontend/src/services/api.js` automatically uses `VITE_API_URL` in production or Vite proxy locally.
* [x] **Production Build Verified**: `npm run build` completed cleanly in `<1s`.
