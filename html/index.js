const { ipcRenderer } = require("electron");
document.addEventListener("keydown", (event) => {
  if (event.key === "F12") {
    //메인프로세스로 toggle-debug 메시지 전송 (디버그 툴 토글시켜라)
    ipcRenderer.send("toggle-debug", "an-argument");
  }
});
const btn = document.getElementById("add");
const main = document.getElementsByTagName("main")[0];
const result = document.getElementById("res");
btn.addEventListener("click", () => {
  ipcRenderer.send("button");
  ipcRenderer.on("status", (e, res) => {
    result.innerText = res;
  });
  ipcRenderer.on("add", (e, res) => {
    for (i = 0; i < res.length; i++) {
      const div = document.createElement("div");
      div.className = "item";
      div.style.backgroundImage = `url(${res[i]})`;
      main.appendChild(div);
    }
  });
});
