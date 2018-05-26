function fixNewLines(data) {
  return data.replace('\r\n', '\n')
}

function removeComments(data) {
  const noComments = data.replace(/(?:<!--)(.|\n)*?(?:-->)/g, '')
  return noComments
}

function parseHeaders(data) {
  return data.replace(/\n(#+) (.*)( {2})*/g,
  (match, p1, p2) => `<span class="h${p1.length}">${p2}</span>`)
}

function parseHR(data) {
  return data.replace(/\n(---(?:-*))\n/g, '<hr>')
}

function parseBullets(data) {
  const ol = data.replace(/(?:^|\n)( *)- (.+)/gm,
  (match, p1, p2) => `\n<span style="padding-left: ${p1.length * 10}px">&bull;&nbsp;&nbsp;&nbsp;${p2}</span>`)

  return ol
}

function parseNumbers(data) {
  const li = data.replace(/\n( *)(\d+)\. (.*)(?: ?)/g,
  (match, p1, p2, p3) => `\n<span style="padding-left: ${p1.length * 10}px">${p2}.&nbsp;${p3}</span>`)

  return li
}

function parseLists(data) {
  return Promise.resolve(data)
  .then(parseBullets)
  .then(parseNumbers)
}

function parseLinks(data) {
  return data.replace(/\[(.*?)\]\((.*?)\)/g,
  (match, p1, p2) => `<a href="${p2}">${p1}</a>`)
}

function bold(data) {
  return data.replace(/\*\*([^*]+)\*\*/g,
  (match, p1) => `<strong>${p1}</strong>`)
}

function italicize(data) {
  return data.replace(/_([^_])+_/g,
  (match, p1) => `<span style="font-style: italic">${p1}</span>`)
}

function addStyles(data) {
  return Promise.resolve(data)
  .then(bold)
  .then(italicize)
}

function parseNewlines(data) {
  const minimized = data.replace(/\n+/g, '\n')
  return minimized.replace(/\n/g, '<br>')
}

module.exports = {
  fixNewLines,
  removeComments,
  parseHeaders,
  parseHR,
  parseBullets,
  parseNumbers,
  parseLists,
  parseLinks,
  bold,
  italicize,
  addStyles,
  parseNewlines
}