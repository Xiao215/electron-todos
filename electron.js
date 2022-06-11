const electron = require("electron");
const { app, BrowserWindow, Menu, ipcMain } = electron;
let mainWindow;
let addWindow;
app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 880,
    title: "Add Item",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.loadURL(`file://${__dirname}/main.html`);
  mainWindow.on("closed", () => app.quit());
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
});
function createAddWindow() {
  addWindow = new BrowserWindow({
    height: 400,
    width: 500,
    title: "Add new todo",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  addWindow.loadURL(`file://${__dirname}/add.html`);
  addWindow.on("closed", () => (addWindow = null));
  //garbage collection and clean up
}
function clearTodos() {
  mainWindow.webContents.send("todo:clear");
}
ipcMain.on("todo:add", (event, todo) => {
  mainWindow.webContents.send("todo:add", todo);
  addWindow.close();
});
const menuTemplate = [
  {
    label: "F",
    submenu: [
      {
        label: "New Todo",
        click() {
          createAddWindow();
        },
      },
      {
        label: "Clear",
        click() {
          clearTodos();
        },
      },
      {
        label: "Quit",
        click() {
          app.quit();
        },
        accelerator: process.platform === "darwin" ? "Command+Q" : "Ctrl+Q",
      },
    ],
  },
  { label: "E", submenu: [{ label: "Old Todo" }] },
];
if (process.platform === "darwin") {
  menuTemplate.unshift({ label: "" });
}
if (process.env.NODE_ENV !== "production") {
  //production, development, staging, test
  menuTemplate.push({
    label: "DEVELOPER",
    submenu: [
      { role: "reload" },
      {
        label: "Toggle Developer Tools",
        click(item, focusedWindow) {
          //item is useless but need to be added
          focusedWindow.toggleDevTools();
        },
        accelerator:
          process.platform === "darwin" ? "Command+Alt+I" : "Ctrl+Shift+I",
      },
    ],
  });
}
