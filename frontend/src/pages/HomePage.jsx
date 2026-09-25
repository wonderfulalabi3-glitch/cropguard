import React from "react";

export default function HomePage({ onStartDetection }) {
  return (
    <main>
      {/* Hero Section */}
      <section className="hero-split container">
        <div className="hero-copy">
          <div className="eyebrow">AI-POWERED AGRONOMY</div>
          <h1>
            Detect crop diseases <span>before they spread.</span>
          </h1>
          <p>
            CropGuard AI combines high-resolution image processing with
            cutting-edge Vision Language Models to diagnose crop pathologies,
            estimate severity, and provide immediate organic and chemical
            treatment protocols.
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary" onClick={onStartDetection}>
              Analyze a Crop Image →
            </button>
            <a className="btn btn-secondary" href="#how-it-works">
              How it works
            </a>
          </div>

          <div className="trust-row">
            <div className="trust-item">
              <strong>Vision AI</strong>
              <small>Zero training overhead</small>
            </div>
            <div className="trust-item">
              <strong>FastAPI</strong>
              <small>High-speed Python backend</small>
            </div>
            <div className="trust-item">
              <strong>Actionable</strong>
              <small>Organic & chemical guidance</small>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="leaf-card">
            <div className="scan-line"></div>
            <div className="leaf-art">🌿</div>
            <span className="scan-label">AI VISION SYSTEM READY</span>
            <div className="floating-badge badge-top">✓ Multimodal AI</div>
            <div className="floating-badge badge-bottom">Instant Pathology</div>
          </div>
        </div>
      </section>

      {/* 4-Step Workflow */}
      <section id="how-it-works" className="section container">
        <div className="section-heading">
          <div className="eyebrow">FOUR STEP WORKFLOW</div>
          <h2>From leaf photograph to clinical insight.</h2>
          <p>
            Designed for farmers, extension workers, and agronomists to diagnose
            foliar infections directly in the field.
          </p>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <div className="feature-icon">01</div>
            <h3>Capture or Upload</h3>
            <p>
              Snap a clear photo of an infected leaf or upload an existing image from your device.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">02</div>
            <h3>FastAPI Processing</h3>
            <p>
              Our backend optimizes image dimensions, validates the payload, and preps it for AI inspection.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">03</div>
            <h3>OpenRouter Vision Model</h3>
            <p>
              Lightweight multimodal models analyze lesion geometry, chlorosis, and textural anomalies.
            </p>
          </article>

          <article className="feature-card">
            <div className="feature-icon">04</div>
            <h3>Integrated Action Plan</h3>
            <p>
              Receive disease classification, confidence level, and safe organic and chemical treatment instructions.
            </p>
          </article>
        </div>
      </section>

      {/* Architecture Highlights */}
      <section className="section container" style={{ paddingTop: 0 }}>
        <div
          style={{
            background: "#ffffff",
            borderRadius: "var(--radius-lg)",
            padding: "48px 40px",
            border: "1px solid var(--border)",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "32px",
            alignItems: "center",
          }}
        >
          <div>
            <div className="eyebrow">MODERN TECH STACK</div>
            <h2 style={{ fontSize: "2rem", marginBottom: "12px" }}>
              React + FastAPI + Vision Language Models
            </h2>
            <p style={{ color: "var(--text-muted)", maxWidth: "600px" }}>
              Unlike brittle legacy CNNs that break on unfamiliar leaf angles, our
              architecture leverages high-reasoning vision models that understand
              complex disease symptoms, multi-infection co-occurrences, and non-plant rejections.
            </p>
          </div>
          <button
            className="btn btn-primary"
            style={{ whiteSpace: "nowrap" }}
            onClick={onStartDetection}
          >
            Launch Diagnosis →
          </button>
        </div>
      </section>
    </main>
  );
}
