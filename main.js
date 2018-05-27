const {app, BrowserWindow, ipcMain} = require('electron')

let win
const Reader = require('./src/reader')

function createWindow () {
  win = new BrowserWindow({width: 800, height: 600})

  win.loadFile('./src/frame/frame.html')

  win.webContents.openDevTools()

  ipcMain.on('openfile', (event, filepath) => Reader.getFile(win, filepath))

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})