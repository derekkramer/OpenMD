require('electron')
.ipcRenderer
.on('markdown', (event, message) => {
  document.getElementById('viewer').innerHTML = message
})