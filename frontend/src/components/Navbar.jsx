import React, { useState } from "react";

export default function Navbar({ activeTab, setActiveTab, backendStatus }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <span className="dot"></span> Demo Mode
        </span>
      );
    }
    return (
      <span className="status-pill offline" title="FastAPI backend is offline">
        <span className="dot"></span> Backend Offline
      </span>
    );
  };

  const handleTabClick = tab => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="site-header">
        <div className="navbar container">
          {/* Brand */}
          <div className="brand" onClick={() => handleTabClick("home")}>
            <span className="brand-mark">✦</span>
            CropGuard <span>AI</span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="nav-links desktop-only">
            <button
              className={`nav-link ${activeTab === "home" ? "active" : ""}`}
              onClick={() => handleTabClick("home")}
            >
              Home
            </button>
            <button
              className={`nav-link ${activeTab === "detect" ? "active" : ""}`}
              onClick={() => handleTabClick("detect")}
            >
              Disease Detection
            </button>
            <button
              className={`nav-link ${activeTab === "about" ? "active" : ""}`}
              onClick={() => handleTabClick("about")}
            >
              About & Architecture
            </button>
          </nav>

          {/* Desktop Right actions */}
          <div className="nav-right desktop-only">
            {getStatusBadge()}
            <button
              className="btn btn-primary"
              style={{ padding: "8px 18px", fontSize: "0.88rem" }}
              onClick={() => handleTabClick("detect")}
            >
              Detect Disease →
            </button>
          </div>

          {/* Mobile Right Controls: Status Pill + Hamburger Toggle */}
          <div className="mobile-header-actions">
            <div className="mobile-status-wrapper">
              {getStatusBadge()}
            </div>
            <button
              className="menu-toggle-btn"
              aria-label="Toggle navigation menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-nav-drawer">
            <button
              className={`mobile-nav-link ${activeTab === "home" ? "active" : ""}`}
              onClick={() => handleTabClick("home")}
            >
              <span>🏠</span> Home
            </button>
            <button
              className={`mobile-nav-link ${activeTab === "detect" ? "active" : ""}`}
              onClick={() => handleTabClick("detect")}
            >
              <span>🌿</span> Disease Detection
            </button>
            <button
              className={`mobile-nav-link ${activeTab === "about" ? "active" : ""}`}
              onClick={() => handleTabClick("about")}
            >
              <span>📖</span> About & Architecture
            </button>

            <div className="mobile-drawer-cta">
              <button
                className="btn btn-primary"
                style={{ width: "100%", padding: "12px", minHeight: "48px" }}
                onClick={() => handleTabClick("detect")}
              >
                Scan a Crop Leaf →
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Modern Thumb-Friendly Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav">
        <button
          className={`bottom-nav-item ${activeTab === "home" ? "active" : ""}`}
          onClick={() => handleTabClick("home")}
        >
          <span className="bottom-nav-icon">🏠</span>
          <span className="bottom-nav-label">Home</span>
        </button>
        <button
          className={`bottom-nav-item highlight ${activeTab === "detect" ? "active" : ""}`}
          onClick={() => handleTabClick("detect")}
        >
          <div className="detect-bubble">
            <span className="bottom-nav-icon">📷</span>
          </div>
          <span className="bottom-nav-label">Detect</span>
        </button>
        <button
          className={`bottom-nav-item ${activeTab === "about" ? "active" : ""}`}
          onClick={() => handleTabClick("about")}
        >
          <span className="bottom-nav-icon">ℹ️</span>
          <span className="bottom-nav-label">About</span>
        </button>
      </nav>
    </>
  );
}
