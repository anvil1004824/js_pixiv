const { ipcRenderer } = require("electron");
const btn = document.getElementById("btn");
btn.addEventListener("click", () => {
  btn.disabled = true;
  btn.classList.add("pending");
  ipcRenderer.send("submit");
});
document.addEventListener("keydown", (event) => {
  if (event.key === "F12") {
    ipcRenderer.send("toggle-debug", "an-argument");
  }
});
