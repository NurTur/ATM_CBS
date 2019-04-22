// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const isDev = require('electron-is-dev');
const path = require('path');
const ELECTRON_DIR = path.resolve(__dirname, '../');

console.log("ggggg", ELECTRON_DIR+ '/dist/index.html');
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true
        }
    })


    mainWindow.loadURL(isDev ? 'http://localhost:8080':ELECTRON_DIR+'/dist/index.html');

    mainWindow.on('closed', () => mainWindow = null);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});