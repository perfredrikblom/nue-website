// script.js - SIMPLE TEST VERSION
console.log("Script loaded");

const testImg = new Image();
testImg.src = 'assets/n.png';
testImg.onload = () => console.log("✅ n.png LOADED SUCCESSFULLY");
testImg.onerror = () => console.log("❌ FAILED to load assets/n.png");

document.body.innerHTML += `
  <div style="position:fixed; top:20px; left:20px; color:white; z-index:100;">
    Testing image load...<br>
    Check console (right-click → Inspect → Console)
  </div>`;