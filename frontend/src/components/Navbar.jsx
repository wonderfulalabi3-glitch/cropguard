import React from "react";

export default function Navbar({ activeTab, setActiveTab, backendStatus }) {
  const getStatusBadge = () => {
    if (!backendStatus) {
      return (
        <span className="status-pill offline" title="Checking server connection...">
          <span className="dot"></span> Connecting...
        </span>
      );
    }
    if (backendStatus.status === "healthy" && backendStatus.api_key_configured) {
      return (
        <span className="status-pill online" title={`AI Model: ${backendStatus.model}`}>
          <span className="dot"></span> AI Vision Online
        </span>
      );
    }
    if (backendStatus.status === "healthy") {
      return (
        <span className="status-pill demo" title="Backend active in Demo / Simulation mode">
          <span className="dot"></span> Demo Mode (Set API Key)
        </span>
      );
    }
    return (
      <span className="status-pill offline" title="FastAPI backend is offline">
        <span className="dot"></span> Backend Offline
      </span>
    );
  };

  return (
    <header className="site-header">
      <div className="navbar container">
        <div className="brand" onClick={() => setActiveTab("home")}>
          <span className="brand-mark">✦</span>
          CropGuard <span>AI</span>
        </div>

        <nav className="nav-links">
          <button
            className={`nav-link ${activeTab === "home" ? "active" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            Home
          </button>
          <button
            className={`nav-link ${activeTab === "detect" ? "active" : ""}`}
            onClick={() => setActiveTab("detect")}
          >
            Disease Detection
          </button>
          <button
            className={`nav-link ${activeTab === "about" ? "active" : ""}`}
            onClick={() => setActiveTab("about")}
          >
            About & Architecture
          </button>
        </nav>

        <div className="nav-right">
          {getStatusBadge()}
          <button
            className="btn btn-primary"
            style={{ padding: "8px 18px", fontSize: "0.88rem" }}
            onClick={() => setActiveTab("detect")}
          >
            Detect Disease →
          </button>
        </div>
      </div>
    </header>
  );
}
