const { app, BrowserWindow, ipcMain } = require("electron");
const { spawn } = require("child_process");
const fs = require("fs");

let ct = 0;
let win;

const createWindow = () => {
  win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  if (fs.existsSync("auth.pickle")) {
    win.loadFile("html/index.html");
  } else {
    win.loadFile("html/login.html");
  }
  ipcMain.on("toggle-debug", (event, arg) => {
    win.webContents.toggleDevTools();
  });
  ipcMain.on("refresh", (event, arg) => {
    win.reload();
  });
};

ipcMain.on("button", (e) => {
  main(e);
});

ipcMain.on("submit", (e) => {
  const loginProcess = spawn("py/.venv/Scripts/python", [
    "py/main.py",
    "get_refresh",
  ]);
  loginProcess.stdout.on("data", (data) => {
    console.log(data.toString());
    win.loadFile("html/index.html");
  });
  loginProcess.stderr.on("data", (data) => {
    console.error(data.toString());
  });
  loginProcess.on("exit", () => {
    console.log("closed");
  });
});

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

function main(e) {
  pythonProcess = spawn("py/.venv/Scripts/python", ["py/main.py", "bookmark"]);
  pythonProcess.stdout.on("data", (data) => {
    if (data.toString().length > 2) {
      bookmark(e, JSON.parse(data.toString()));
    }
  });
}

function download(url, name, path, e, bookmarkList, tt) {
  const pr = spawn("python", ["py/download.py", url, name, path]);
  pr.stdout.on("data", (data) => {
    ct += 1;
    e.reply("status", `${ct}/${tt}`);
    if (tt === ct) {
      console.log("COMPLETE");
      e.reply("add", bookmarkList);
    }
  });
}

function bookmark(e, res) {
  let bookmarkList = [];
  ct = 0;
  let tot = 0;
  for (i = 0; i < res.length; i++) {
    for (j = 0; j < res[i].urls.length; j++) {
      tot += 1;
    }
    bookmarkList.push(`../image/${i}/${i}_0.png`);
  }
  for (i = 0; i < res.length; i++) {
    for (j = 0; j < res[i].urls.length; j++) {
      download(res[i].urls[j], `${i}_${j}`, i, e, bookmarkList, tot);
    }
  }
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
