import React, { useState } from "react";
import DropZone from "../components/DropZone";
import AnalysisResult from "../components/AnalysisResult";
import { analyzeCropImage } from "../services/api";

export default function DetectPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [cropHint, setCropHint] = useState("Auto-Detect");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileSelect = file => {
    setSelectedFile(file);
    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.onload = e => {
      setPreviewUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await analyzeCropImage(selectedFile, cropHint);
      setResult(data);

      // Smooth scroll to the result section
      setTimeout(() => {
        const el = document.getElementById("diagnosis-result");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } catch (err) {
      console.error("Diagnosis error:", err);
      setError(err.message || "Failed to analyze crop image. Please check your backend connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container" style={{ paddingBottom: "60px" }}>
      <section className="page-hero">
        <span className="eyebrow">CLINICAL PLANT PATHOLOGY</span>
        <h1>Analyze a crop leaf image.</h1>
        <p>
          Upload a clear photograph of a crop leaf or stem. The standardized
          diagnostic engine analyzes morphological cues, verifies botanical
          structures, and formulates an explainable clinical treatment plan.
        </p>
      </section>

      {error && (
        <div className="error-alert">
          <div>
            <strong>Error:</strong> {error}
          </div>
          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: "4px 10px", fontSize: "0.82rem" }}
            onClick={() => setError(null)}
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="detection-grid">
        <DropZone
          selectedFile={selectedFile}
          previewUrl={previewUrl}
          isLoading={isLoading}
          cropHint={cropHint}
          setCropHint={setCropHint}
          onFileSelect={handleFileSelect}
          onAnalyze={handleAnalyze}
          onClear={handleClear}
        />

        <aside className="info-sidebar">
          <div className="info-card">
            <span className="eyebrow">RELIABILITY GUIDELINES</span>
            <h3>How to ensure consistent diagnoses</h3>
            <ul className="check-list">
              <li>
                <span>✓</span> <strong>Center on symptomatic foliage</strong>: Fill most of the frame with the leaf blade and lesions.
              </li>
              <li>
                <span>✓</span> <strong>Natural diffuse lighting</strong>: Avoid harsh direct flash or heavy shadows that mask chlorosis.
              </li>
              <li>
                <span>✓</span> <strong>De-bias background</strong>: Try placing the leaf flat on clean paper or ground without fingers obscuring veins.
              </li>
              <li>
                <span>✓</span> <strong>Specify Crop Hint</strong>: If you know the species (e.g. Tomato, Corn), selecting it eliminates cross-species ambiguity.
              </li>
            </ul>
            <div className="notice-box">
              <strong>Pre-processing Active:</strong> Smartphone photos are automatically orientation-corrected and normalized to optimal vision resolution.
            </div>
          </div>
        </aside>
      </div>

      {result && <AnalysisResult result={result} onReset={handleClear} />}
    </main>
  );
}
