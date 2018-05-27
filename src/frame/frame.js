window.eval = global.eval = function() {
  throw new Error(`Sorry, this app does not support window.eval().`)
}

var electron = require('electron')

electron.ipcRenderer
.on('markdown', function(event, message) {
  document.getElementById('viewer').innerHTML = message
})

document.addEventListener('dragover', function(event){
  event.preventDefault()
  event.dataTransfer.dropEffect = 'copy'
})

document.addEventListener('drop', function(event){
  event.preventDefault()
  let path = event.dataTransfer.files[0].path
  
  document.title = 'OpenMD  [' + path.match(/(\/[^\/]*){3}$/)[0] + ']'

  electron.ipcRenderer.send('openfile', path)
})