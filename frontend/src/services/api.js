const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Backend health check failed:", err.message);
    return { status: "offline", error: err.message };
  }
}

export async function analyzeCropImage(file, cropHint = "") {
  const formData = new FormData();
  formData.append("file", file);
  if (cropHint && cropHint.trim()) {
    formData.append("crop_hint", cropHint.trim());
  }

  const res = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    let errorDetail = "An unexpected error occurred during analysis.";
    try {
      const errData = await res.json();
      if (errData && errData.detail) {
        errorDetail = errData.detail;
      }
    } catch {
      errorDetail = `Server responded with status ${res.status}`;
    }
    throw new Error(errorDetail);
  }

  return await res.json();
}
