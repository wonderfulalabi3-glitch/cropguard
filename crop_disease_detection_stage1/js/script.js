document.addEventListener("DOMContentLoaded", () => {
  const menu = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  if (menu && nav) {
    menu.addEventListener("click", () => {
      nav.style.display = nav.style.display === "flex" ? "" : "flex";
      nav.style.flexDirection = "column";
      nav.style.position = "absolute";
      nav.style.top = "76px";
      nav.style.left = "0";
      nav.style.right = "0";
      nav.style.padding = "18px 20px";
      nav.style.background = "white";
      nav.style.borderBottom = "1px solid #dfe5dd";
    });
  }

  const input = document.getElementById("imageInput");
  const dropZone = document.getElementById("dropZone");
  const chooseBtn = document.getElementById("chooseBtn");
  const changeBtn = document.getElementById("changeBtn");
  const prompt = document.getElementById("uploadPrompt");
  const previewArea = document.getElementById("previewArea");
  const preview = document.getElementById("imagePreview");
  const fileName = document.getElementById("fileName");
  const fileSize = document.getElementById("fileSize");
  const analyzeBtn = document.getElementById("analyzeBtn");
  const resultSection = document.getElementById("resultSection");

  if (!input) return;

  chooseBtn.addEventListener("click", () => input.click());
  changeBtn.addEventListener("click", () => input.click());

  ["dragenter", "dragover"].forEach(eventName => {
    dropZone.addEventListener(eventName, e => {
      e.preventDefault();
      dropZone.style.borderColor = "#2f8a5c";
      dropZone.style.background = "#f1f8f3";
    });
  });

  ["dragleave", "drop"].forEach(eventName => {
    dropZone.addEventListener(eventName, e => {
      e.preventDefault();
      dropZone.style.borderColor = "";
      dropZone.style.background = "";
    });
  });

  dropZone.addEventListener("drop", e => {
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  });

  input.addEventListener("change", e => {
    if (e.target.files[0]) handleFile(e.target.files[0]);
  });

  function handleFile(file) {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      preview.src = e.target.result;
      fileName.textContent = file.name;
      fileSize.textContent = formatBytes(file.size);
      prompt.classList.add("hidden");
      previewArea.classList.remove("hidden");
      analyzeBtn.disabled = false;
      resultSection?.classList.add("hidden");
    };
    reader.readAsDataURL(file);
  }

  analyzeBtn?.addEventListener("click", () => {
    resultSection?.classList.remove("hidden");
    resultSection?.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  function formatBytes(bytes) {
    if (!bytes) return "0 Bytes";
    const units = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${units[i]}`;
  }
});
