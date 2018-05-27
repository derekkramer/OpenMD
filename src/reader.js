const fs = require('fs')
const parser = require('./scripts/parser')
const {ipcMain} = require('electron')

const path = './src/README.md'

function getFile(win, filepath) {
  fs.readFile(filepath, 'utf8', (err, data) => {
    if (err) throw err

    parseMarkdown(data, win)
  })
}

function parseMarkdown(data, win) {
  parser.parseMarkdown(data)
  .then((final) => {
    if(!win.webContents.isLoading()) win.webContents.send('markdown', final)
  })
}

module.exports = {
  getFile
}