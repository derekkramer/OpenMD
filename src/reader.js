const fs = require('fs')
const parser = require('./scripts/parser')

const path = './src/README.md'

function getFile(win) {
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) throw err

    parseMarkdown(data, win)
  })
}

function parseMarkdown(data, win) {
  parser.parseMarkdown(data)
  .then((final) => {
    win.webContents.on('did-finish-load', () => {
      win.webContents.send('markdown', final)
    })
  })
}

module.exports = function(win) {
  this.getFile = getFile(win)
}