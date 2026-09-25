import React from "react";

export default function AboutPage() {
  return (
    <main className="container" style={{ paddingBottom: "60px" }}>
      <section className="page-hero">
        <span className="eyebrow">ABOUT THE PLATFORM</span>
        <h1>AI for practical crop disease diagnostics.</h1>
        <p>
          CropGuard AI empowers agricultural stakeholders with instant,
          science-backed disease detection, eliminating the need for expensive
          hardware and offline model maintenance.
        </p>
      </section>

      <section className="about-grid">
        <article className="about-card">
          <div className="eyebrow">OBJECTIVE</div>
          <h3>Rapid Field Decision Support</h3>
          <p>
            Provide smallholder farmers and agricultural extension specialists
            with instant, actionable recommendations before localized leaf
            infections turn into catastrophic field-wide crop loss.
          </p>
        </article>

        <article className="about-card">
          <div className="eyebrow">ARCHITECTURE</div>
          <h3>API-First Vision Intelligence</h3>
          <p>
            By delegating visual feature extraction to high-reasoning Vision
            Language Models via OpenRouter, we unlock deep symptom analysis and
            organic treatment recommendations without massive dataset overhead.
          </p>
        </article>

        <article className="about-card">
          <div className="eyebrow">RELIABILITY</div>
          <h3>Structured Schema Validation</h3>
          <p>
            Every response from the AI model is validated through Pydantic
            models on FastAPI to guarantee strictly typed diagnoses, confidence
            metrics, and safety guardrails.
          </p>
        </article>
      </section>

      {/* Comparison Table */}
      <section className="section" style={{ paddingTop: "20px" }}>
        <div className="section-heading">
          <span className="eyebrow">ARCHITECTURAL ADVANTAGE</span>
          <h2>Why Vision LLMs Surpass Traditional CNNs</h2>
          <p>
            A comparison between traditional Convolutional Neural Networks (e.g. ResNet/MobileNet) and our Vision API architecture.
          </p>
        </div>

        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Feature / Capability</th>
                <th>Traditional CNN (ResNet / MobileNet)</th>
                <th>CropGuard AI (Vision LLM via OpenRouter)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Training Data Required</strong></td>
                <td>50,000+ labeled leaf photos with balanced classes</td>
                <td>Zero dataset curation needed; uses pre-trained reasoning</td>
              </tr>
              <tr>
                <td><strong>Diagnosis Output</strong></td>
                <td>Rigid class name & percentage (e.g. "Early Blight: 88%")</td>
                <td>Full clinical diagnosis, visual symptoms, and stage</td>
              </tr>
              <tr>
                <td><strong>Severity & Spread Estimation</strong></td>
                <td>Not supported natively; requires separate models</td>
                <td>Directly estimates severity (Mild, Moderate, Severe)</td>
              </tr>
              <tr>
                <td><strong>Actionable Guidance</strong></td>
                <td>Requires manual static lookup database</td>
                <td>Dynamic organic, chemical, and cultural management advice</td>
              </tr>
              <tr>
                <td><strong>Invalid / Non-Plant Handling</strong></td>
                <td>Forces a false positive label even on shoes/cars</td>
                <td>Detects non-crop images and politely requests a valid leaf</td>
              </tr>
              <tr>
                <td><strong>Deployment & Infrastructure</strong></td>
                <td>Heavy GPU server or ONNX web runtime</td>
                <td>Lightweight Python FastAPI + standard HTTPS requests</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
