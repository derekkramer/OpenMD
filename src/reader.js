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
  Promise.resolve(data)
  .then(parser.fixNewLines)
  .then(parser.removeComments)
  .then(parser.parseHeaders)
  .then(parser.parseHR)
  .then(parser.parseLists)
  .then(parser.parseLinks)
  .then(parser.addStyles)
  .then(parser.parseNewlines)
  .then((final) => {
    win.webContents.on('did-finish-load', () => {
      win.webContents.send('markdown', final)
    })
  })
}

module.exports = function(win) {
  this.getFile = getFile(win)
}