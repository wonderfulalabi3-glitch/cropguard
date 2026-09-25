import React from "react";

export default function LoadingScanner() {
  return (
    <div className="scanner-overlay">
      <div className="scanning-laser"></div>
      <div className="scanning-badge">
        <span>⚡ AI VISION ANALYZING CROP TISSUE...</span>
      </div>
    </div>
  );
}
