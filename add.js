const electron = require("electron");
const { ipcRenderer } = electron;
document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  const { value } = document.querySelector("input");
  ipcRenderer.send("todo:add", value);
});
