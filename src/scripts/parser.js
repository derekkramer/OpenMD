const Regexer = require('./regexer')

function fixNewLines(data) {
  return data.replace('\r\n', '\n')
}

function removeComments(data) {
  return data.replace(Regexer.comment, '')
}

function parseHeaders(data) {
  return data.replace(Regexer.header,
    (match, p1, p2) => `<span class="h${p1.length}">${p2}</span>\n`)
}

function parseHR(data) {
  return data.replace(Regexer.hr, '<hr>')
}

function parseCode(data) {
  return data.replace(Regexer.code, (match, p1) => {
    console.log(p1);
    return `<div class="code">${p1}</div>`
  })
}

function parseLists(data) {
  return new Promise((resolve, reject) => {
    let lines = data.split('\n')
    let onBullets = false
    let onNumbers = false

    for(let i = 0; i < lines.length; i++) {
      let bulletMatch = lines[i].match(Regexer.bullet)
      let numberMatch = lines[i].match(Regexer.number)

      if(bulletMatch) {
        [
          lines[i],
          onBullets,
          onNumbers
        ] = translateCode(onBullets, onNumbers, Regexer.bullet, Regexer.number, lines[i], lines[i + 1], bulletCode)
      }else if(numberMatch) {
        [
          lines[i],
          onNumbers,
          onBullets
        ] = translateCode(onBullets, onNumbers, Regexer.number, Regexer.bullet, lines[i], lines[i + 1], numberCode)
      }

      if(i === lines.length - 1) resolve(lines.join('\n'))
    }
  })
}

function translateCode(primary, secondary, primaryRegex, secondaryRegex, original, next, replacement) {
  original = original.replace(primaryRegex, replacement)

  let nextPrimaryMatch
  let nextSecondaryMatch

  if(next !== undefined) {
    nextPrimaryMatch = next.match(primaryRegex)
    nextSecondaryMatch = next.match(secondaryRegex)
  }

  if(!primary && !secondary) {
    original = '<p>' + original
    primary = true
  }

  if(next !== undefined && !nextPrimaryMatch && !nextSecondaryMatch) {
    original = original.replace('<br>', '</p>')
    primary = false
    secondary = false
  }

  return [
    original,
    primary,
    secondary
  ]
}

function bulletCode(match, p1, p2, p3) {
  return `<span style="padding-left: ${p1.length * 10}px">&bull;&nbsp;&nbsp;&nbsp;${p2}</span><br>`
}

function numberCode(match, p1, p2, p3) {
  return `<span style="padding-left: ${p1.length * 10}px">${p2}.&nbsp;${p3}</span><br>`
}

function parseLinks(data) {
  return data.replace(Regexer.link,
    (match, p1, p2) => `<a href="${p2}">${p1}</a>`)
}

function bold(data) {
  return data.replace(Regexer.bold,
    (match, p1) => `<strong>${p1}</strong>`)
}

function italicize(data) {
  return data.replace(Regexer.italic,
    (match, p1) => `<span style="font-style: italic">${p1}</span>`)
}

function addStyles(data) {
  return Promise.resolve(data)
  .then(bold)
  .then(italicize)
}

function addTrailingNewline(data) {
  return data.slice(-2) === '\n' ? data : data + '\n'
}

function parseParagraphs(data) {
  return new Promise((resolve, reject) => {
    data = data.split('\n')
    let i = 0

    data.forEach((line) => {
      if(line.length && !containsTags(line)) {
        data[i] = `<p>${data[i]}</p>`
      }

      i++

      if(i === data.length) resolve(data.join('\n'))
    })
  })
}

function containsTags(line) {
  return line.match(Regexer.tags.span) ||
    line.match(Regexer.tags.p) ||
    line.match(Regexer.tags.hr)
}

function squashNewlines(data) {
  return data.replace(/(\n{3,})/g, '\n\n')
}

function parseMarkdown(data) {
  return Promise.resolve(data)
  .then(fixNewLines)
  .then(removeComments)
  .then(parseHeaders)
  .then(parseHR)
  .then(parseCode)
  .then(parseLists)
  .then(parseLinks)
  .then(addStyles)
  .then(addTrailingNewline)
  .then(parseParagraphs)
  .then(squashNewlines)
}

module.exports = {
  parseMarkdown
}