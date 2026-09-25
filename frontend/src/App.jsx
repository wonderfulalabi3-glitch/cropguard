import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import DetectPage from "./pages/DetectPage";
import AboutPage from "./pages/AboutPage";
import { checkBackendHealth } from "./services/api";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [backendStatus, setBackendStatus] = useState(null);

  useEffect(() => {
    async function loadHealth() {
      const data = await checkBackendHealth();
      setBackendStatus(data);
    }
    loadHealth();

    // Check health every 20 seconds
    const timer = setInterval(loadHealth, 20000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="app-layout">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendStatus={backendStatus}
      />

      {activeTab === "home" && (
        <HomePage onStartDetection={() => setActiveTab("detect")} />
      )}
      {activeTab === "detect" && <DetectPage />}
      {activeTab === "about" && <AboutPage />}

      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <strong>CropGuard AI</strong> — Multimodal Agricultural Diagnostics
          </div>
          <div>© {new Date().getFullYear()} CropGuard Systems. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
