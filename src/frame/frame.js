window.eval = global.eval = function () {
  throw new Error(`Sorry, this app does not support window.eval().`)
}

require('electron')
.ipcRenderer
.on('markdown', (event, message) => {
  document.getElementById('viewer').innerHTML = message
})