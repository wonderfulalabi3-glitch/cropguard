import React from "react";

export default function AnalysisResult({ result, onReset }) {
  if (!result) return null;

  const {
    is_plant,
    crop_name,
    condition,
    status,
    confidence,
    severity,
    pathogen_type,
    affected_part,
    diagnostic_reasoning,
    visual_symptoms,
    description,
    treatment,
    model_used,
    is_demo_mock,
  } = result;

  const getStatusBadgeClass = () => {
    switch (status) {
      case "healthy":
        return "badge-healthy";
      case "diseased":
        return "badge-diseased";
      case "pest_damage":
        return "badge-warning";
      default:
        return "badge-invalid";
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case "healthy":
        return "✓ Healthy Plant";
      case "diseased":
        return "⚠ Disease Detected";
      case "pest_damage":
        return "🐜 Pest Infestation";
      default:
        return "✕ Non-Plant Image";
    }
  };

  const getPathogenColor = () => {
    switch (pathogen_type) {
      case "Fungal":
        return { bg: "#fef3c7", color: "#92400e", border: "#fde68a" };
      case "Bacterial":
        return { bg: "#fee2e2", color: "#991b1b", border: "#fecaca" };
      case "Viral":
        return { bg: "#f3e8ff", color: "#6b21a8", border: "#e9d5ff" };
      case "Pest / Insect":
        return { bg: "#ffedd5", color: "#9a3412", border: "#fed7aa" };
      case "Abiotic / Nutrient":
        return { bg: "#e0f2fe", color: "#075985", border: "#bae6fd" };
      default:
        return { bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0" };
    }
  };

  const confidencePercent = Math.round((confidence || 0) * 100);

  return (
    <div className="result-container" id="diagnosis-result">
      {is_demo_mock && (
        <div className="demo-banner">
          <span>
            <strong>Demo Simulation Mode:</strong> Backend returned an agronomic simulation. Set your <code>OPENROUTER_API_KEY</code> in <code>backend/.env</code> to enable live vision inference.
          </span>
        </div>
      )}

      <div className="result-card">
        {/* Header */}
        <div className="result-header">
          <div className="result-title-group">
            <span className="eyebrow">CLINICAL PATHOLOGY REPORT</span>
            <h2>
              {condition || "Condition Analysis"}
              <span className={`badge ${getStatusBadgeClass()}`}>
                {getStatusLabel()}
              </span>
            </h2>
            {crop_name && (
              <p className="result-crop-name">
                Identified Host: <strong>{crop_name}</strong>
              </p>
            )}
          </div>

          <button type="button" className="btn btn-outline" onClick={onReset}>
            Analyze Another Leaf
          </button>
        </div>

        {/* Metrics Row */}
        {is_plant && (
          <div className="metrics-row">
            <div className="metric-box">
              <h4>Calibrated Confidence</h4>
              <div className="confidence-bar-wrapper">
                <div className="confidence-bar">
                  <div
                    className="confidence-fill"
                    style={{ width: `${confidencePercent}%` }}
                  ></div>
                </div>
                <span className="confidence-percent">{confidencePercent}%</span>
              </div>
            </div>

            <div className="metric-box">
              <h4>Pathology Markers</h4>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
                <span className={`severity-pill severity-${severity || "None"}`}>
                  Severity: {severity || "None"}
                </span>

                {pathogen_type && (
                  <span
                    style={{
                      background: getPathogenColor().bg,
                      color: getPathogenColor().color,
                      border: `1px solid ${getPathogenColor().border}`,
                      borderRadius: "6px",
                      padding: "4px 10px",
                      fontSize: "0.85rem",
                      fontWeight: "700",
                    }}
                  >
                    Etiology: {pathogen_type}
                  </span>
                )}

                {affected_part && (
                  <span
                    style={{
                      background: "#f3f4f6",
                      color: "#374151",
                      borderRadius: "6px",
                      padding: "4px 10px",
                      fontSize: "0.82rem",
                      fontWeight: "600",
                    }}
                  >
                    Region: {affected_part}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Result Body */}
        <div className="result-body">
          {/* Explainable Diagnostic Reasoning Section */}
          {diagnostic_reasoning && (
            <div
              style={{
                background: "#f0f7f3",
                border: "1px solid #c7e3d2",
                borderLeft: "5px solid var(--primary)",
                borderRadius: "var(--radius-sm)",
                padding: "20px 24px",
                marginBottom: "28px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "0.88rem",
                  fontWeight: "800",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--primary)",
                  marginBottom: "8px",
                }}
              >
                <span>🔬</span> Explainable Diagnostic Reasoning
              </div>
              <p style={{ fontSize: "1rem", color: "#1e3a2b", lineHeight: 1.65 }}>
                {diagnostic_reasoning}
              </p>
            </div>
          )}

          {/* Diagnostic Summary */}
          <div className="description-box">
            <h4 style={{ fontSize: "0.95rem", color: "var(--text-muted)", marginBottom: "6px", textTransform: "uppercase" }}>
              Pathology & Yield Impact
            </h4>
            <p>{description}</p>
          </div>

          {/* Visual Symptoms */}
          {visual_symptoms && visual_symptoms.length > 0 && (
            <section className="symptoms-section">
              <h3>Observed Diagnostic Cues</h3>
              <div className="symptoms-grid">
                {visual_symptoms.map((symptom, idx) => (
                  <div key={idx} className="symptom-tag">
                    <span>🔍</span>
                    <div>{symptom}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Treatment Plan */}
          {treatment && is_plant && (
            <section className="treatment-section">
              <h3>Clinical Action Plan & Treatment</h3>
              <div className="treatment-grid">
                {/* Organic Control */}
                <div className="treatment-card organic">
                  <h4>🌱 Organic & Cultural Management</h4>
                  <ul>
                    {treatment.organic_control?.length > 0 ? (
                      treatment.organic_control.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))
                    ) : (
                      <li>No organic interventions necessary for healthy foliage.</li>
                    )}
                  </ul>
                </div>

                {/* Chemical Control */}
                <div className="treatment-card chemical">
                  <h4>🧪 Targeted Chemical / Fungicidal Control</h4>
                  <ul>
                    {treatment.chemical_control?.length > 0 ? (
                      treatment.chemical_control.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))
                    ) : (
                      <li>No synthetic chemical intervention required.</li>
                    )}
                  </ul>
                </div>

                {/* Preventative Measures */}
                <div className="treatment-card prevention">
                  <h4>🛡️ Long-Term Preventative Protocols</h4>
                  <ul>
                    {treatment.preventative_measures?.length > 0 ? (
                      treatment.preventative_measures.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))
                    ) : (
                      <li>Maintain optimal watering and soil sanitation routines.</li>
                    )}
                  </ul>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="result-footer">
          <div>
            Inference Engine:{" "}
            <span className="model-tag">
              {model_used || "OpenRouter Vision Model"}
            </span>
          </div>
          <div>
            <span>⚡ Standardized 2026 Plant Pathology Protocol</span>
          </div>
        </div>
      </div>
    </div>
  );
}
