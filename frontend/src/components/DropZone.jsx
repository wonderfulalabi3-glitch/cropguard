import React, { useRef, useState } from "react";
import LoadingScanner from "./LoadingScanner";

// Helper function to create sample leaf images for instant testing
function createSampleLeafBlob(type) {
  const canvas = document.createElement("canvas");
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#eef4ef";
  ctx.fillRect(0, 0, 400, 400);

  // Draw Leaf Shape
  ctx.save();
  ctx.translate(200, 200);
  ctx.beginPath();
  ctx.moveTo(0, -140);
  ctx.bezierCurveTo(90, -100, 110, 80, 0, 150);
  ctx.bezierCurveTo(-110, 80, -90, -100, 0, -140);

  if (type === "blight") {
    // Diseased leaf (yellow-green with brown lesions)
    ctx.fillStyle = "#7ca34d";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#4d6b2c";
    ctx.stroke();

    // Central vein
    ctx.beginPath();
    ctx.moveTo(0, -130);
    ctx.lineTo(0, 140);
    ctx.strokeStyle = "#405c21";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Concentric Blight Lesions
    const drawLesion = (x, y, r) => {
      // Yellow chlorotic halo
      ctx.beginPath();
      ctx.arc(x, y, r + 8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(227, 196, 48, 0.75)";
      ctx.fill();

      // Outer brown necrotic ring
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = "#5c3a21";
      ctx.fill();

      // Inner darker core
      ctx.beginPath();
      ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
      ctx.fillStyle = "#331c0e";
      ctx.fill();
    };

    drawLesion(35, -20, 22);
    drawLesion(-30, 45, 18);
    drawLesion(20, 75, 14);
  } else if (type === "healthy") {
    // Healthy vibrant leaf
    ctx.fillStyle = "#2ecc71";
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#27ae60";
    ctx.stroke();

    // Leaf veins
    ctx.beginPath();
    ctx.moveTo(0, -130);
    ctx.lineTo(0, 140);
    ctx.strokeStyle = "#1e824c";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Side veins
    for (let i = -80; i < 100; i += 30) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(40, i - 15);
      ctx.moveTo(0, i);
      ctx.lineTo(-40, i - 15);
      ctx.strokeStyle = "#239b56";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  } else {
    // Non-plant sample (e.g. coffee mug)
    ctx.fillStyle = "#dfe6e9";
    ctx.fillRect(-150, -150, 300, 300);
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    ctx.roundRect(-60, -60, 120, 140, [10, 10, 25, 25]);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("COFFEE", 0, 15);
  }

  ctx.restore();

  return new Promise(resolve => {
    canvas.toBlob(blob => {
      resolve(blob);
    }, "image/jpeg", 0.95);
  });
}

function formatBytes(bytes) {
  if (!bytes) return "0 Bytes";
  const units = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${units[i]}`;
}

export default function DropZone({
  selectedFile,
  previewUrl,
  isLoading,
  cropHint,
  setCropHint,
  onFileSelect,
  onAnalyze,
  onClear,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleDragEnter = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        onFileSelect(file);
      } else {
        alert("Please upload an image file (JPG, PNG, WebP).");
      }
    }
  };

  const handleInputChange = e => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const loadSample = async (type, filename, hint) => {
    if (hint && setCropHint) {
      setCropHint(hint);
    }
    const blob = await createSampleLeafBlob(type);
    const file = new File([blob], filename, { type: "image/jpeg" });
    onFileSelect(file);
  };

  return (
    <div className="upload-card">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleInputChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={handleInputChange}
      />

      {/* Crop Hint Selector for Peak Accuracy */}
      <div style={{ marginBottom: "18px" }}>
        <label
          style={{
            display: "block",
            fontSize: "0.85rem",
            fontWeight: "700",
            color: "var(--text-dark)",
            marginBottom: "6px",
          }}
        >
          🌾 Plant Host / Crop Specimen (Optional)
        </label>
        <select
          value={cropHint}
          onChange={e => setCropHint(e.target.value)}
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "10px 14px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--border)",
            fontSize: "0.95rem",
            background: "#ffffff",
            color: "var(--text-dark)",
            cursor: "pointer",
          }}
        >
          <option value="Auto-Detect">Auto-Detect (AI identifies crop species)</option>
          <option value="Tomato">Tomato (Solanum lycopersicum)</option>
          <option value="Corn / Maize">Corn / Maize (Zea mays)</option>
          <option value="Potato">Potato (Solanum tuberosum)</option>
          <option value="Rice">Rice (Oryza sativa)</option>
          <option value="Wheat">Wheat (Triticum)</option>
          <option value="Pepper">Pepper / Bell Pepper (Capsicum)</option>
          <option value="Grape">Grape / Grapevine (Vitis vinifera)</option>
          <option value="Apple">Apple (Malus domestica)</option>
          <option value="Cotton">Cotton (Gossypium)</option>
          <option value="Soybean">Soybean (Glycine max)</option>
          <option value="Cassava">Cassava (Manihot esculenta)</option>
          <option value="Citrus">Citrus / Lemon / Orange</option>
          <option value="Cucumber / Melon">Cucumber / Squash / Melon</option>
        </select>
        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
          Selecting your crop provides domain constraints that maximize diagnostic precision.
        </span>
      </div>

      {!previewUrl ? (
        <div
          className={`drop-zone ${isDragOver ? "dragover" : ""}`}
          onDragOver={handleDragEnter}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="upload-icon">↑</div>
          <h3>Drop your crop leaf photo here</h3>
          <p>or click to browse from your device / storage</p>

          <div className="dropzone-actions-row">
            <button
              type="button"
              className="btn btn-primary dropzone-btn"
              onClick={e => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Choose Image
            </button>
            <button
              type="button"
              className="btn btn-secondary dropzone-btn"
              onClick={e => {
                e.stopPropagation();
                cameraInputRef.current?.click();
              }}
            >
              📷 Take Photo
            </button>
          </div>

          <small>Supported formats: JPG, PNG, WebP (Auto-oriented & normalized)</small>

          <div className="samples-row" onClick={e => e.stopPropagation()}>
            <span className="samples-label">Quick test with verified samples:</span>
            <div className="samples-list">
              <button
                type="button"
                className="sample-chip"
                onClick={() => loadSample("blight", "tomato_early_blight_sample.jpg", "Tomato")}
              >
                🍂 Tomato (Early Blight)
              </button>
              <button
                type="button"
                className="sample-chip"
                onClick={() => loadSample("healthy", "healthy_maize_leaf.jpg", "Corn / Maize")}
              >
                🌿 Healthy Leaf
              </button>
              <button
                type="button"
                className="sample-chip"
                onClick={() => loadSample("non-plant", "non_plant_object.jpg", "Auto-Detect")}
              >
                ☕ Non-Plant Object
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="preview-container">
          <div className="preview-image-wrapper">
            <img src={previewUrl} alt="Crop Leaf Preview" className="preview-image" />
            {isLoading && <LoadingScanner />}
          </div>

          <div className="file-meta">
            <span className="file-name">{selectedFile?.name || "Uploaded Image"}</span>
            <span className="file-size">({formatBytes(selectedFile?.size)})</span>
          </div>

          <div className="preview-actions-row">
            <button
              type="button"
              className="btn btn-outline preview-action-btn"
              disabled={isLoading}
              onClick={() => fileInputRef.current?.click()}
            >
              Change Image
            </button>
            <button
              type="button"
              className="btn btn-outline preview-action-btn"
              disabled={isLoading}
              onClick={onClear}
            >
              Remove
            </button>
          </div>
        </div>
      )}

      <div className="upload-card-footer">
        <span className="upload-hint">
          🔬 Clinical Plant Pathology Reasoning Protocol active
        </span>
        <button
          type="button"
          className="btn btn-primary analyze-action-btn"
          disabled={!selectedFile || isLoading}
          onClick={onAnalyze}
        >
          {isLoading ? "Executing Clinical Inspection..." : "Run AI Pathology Analysis →"}
        </button>
      </div>
    </div>
  );
}
