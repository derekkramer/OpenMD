function fixNewLines(data) {
  return data.replace('\r\n', '\n')
}

function removeComments(data) {
  return data.replace(/(?:<!--)(.|\n)*?(?:-->)/g, '')
}

function parseHeaders(data) {
  return data.replace(/(#+) (.*)( {2})*\n/g,
    (match, p1, p2) =>
      `<span class="h${p1.length}">${p2}</span>\n`)
}

function parseHR(data) {
  return data.replace(/(---(?:-?))\n/g, '<hr>')
}

function parseBullets(data) {
  return new Promise((resolve, reject) => {
    let lines = data.split('\n')
    let onBullets = false

    for(let i = 0; i < lines.length; i++) {
      if(lines[i].match(/^( *?)- (.+?)$/gm)) {
        lines[i] = lines[i].replace(/^( *?)- (.+?)$/gm,
          (match, p1, p2) =>
            `<span style="padding-left: ${p1.length * 10}px">&bull;&nbsp;&nbsp;&nbsp;${p2}</span><br>`)

        if(!onBullets) {
          lines[i] = '<p>' + lines[i]
          onBullets = true
        }

        if(lines[i + 1] !== undefined && !lines[i + 1].match(/^( *?)- (.+?)$/gm)) {
          lines[i] = lines[i].replace('<br>', '</p>')
          onBullets = false
        }
      }

      if(i === lines.length - 1) resolve(lines.join('\n'))
    }
  })
}

function parseNumbers(data) {
  console.log(data);
  const li = data.replace(/( *)(\d+)\. (.*)\n/gm,
  (match, p1, p2, p3) => `<span data-number="${p2}" style="padding-left: ${p1.length * 10}px">${p2}.&nbsp;${p3}</span><br>`)

  return li
}

function groupNumbers(data) {
  return new Promise((resolve, reject) => {
    let numbers = data.match(/<span data-number=(.*?)<\/span>/g)
    let i = 0
    let current = 1
    let last = ''
    let positions = []

    numbers.forEach((number) => {
      if(i === 0) {
        positions.push(number)
      } else {
        let newNumber = +number.slice(19, 20)

        if (newNumber < current) positions = [...positions, last, number]

        current = newNumber
        last = number
      }

      i++

      if(i === numbers.length) {
        positions.push(number)
        resolve({
          data,
          positions
        })
      }
    })
  })
}

function addNumbersTags(numberData) {
  return new Promise((resolve, reject) => {
    let { positions, data } = numberData

    for(let i = 1; i <= positions.length; i++) {
      let current = positions[i - 1]
      let currentPosition = data.indexOf(current)
      if(i % 2) {
        data = data.substr(0, currentPosition) +
          '<p>' +
          data.substr(currentPosition)
      } else {
        data = data.substr(0, currentPosition + current.length) +
          '</p>' +
          data.substr(currentPosition + current.length + 4)
      }

      if(i === positions.length) {
        resolve(data.replace(/data-number="\d"\s/g, ''))
      }
    }
  })
}

function parseLists(data) {
  return Promise.resolve(data)
  .then(parseBullets)
  // .then(groupBullets)
  .then(parseNumbers)
  .then(groupNumbers)
  .then(addNumbersTags)
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

function addTrailingNewline(data) {
  if (data.slice(-2) !== '\n') data += '\n'
  return data
}

function parseParagraphs(data) {
  return new Promise((resolve, reject) => {
    data = data.split('\n')
    let i = 0

    data.forEach((line) => {
      if(line.length) {
        if(!containsTags(line)) {
          data[i] = `<p>${data[i]}</p>`
        }
      }

      i++

      if(i === data.length) resolve(data.join('\n'))
    })
  })
}

function containsTags(line) {
  return line.match(/(?:<a.*?>)/g) ||
    line.match(/(?:<span.*?>)/g) ||
    line.match(/(?:<p>)/g) ||
    line.match(/(?:<hr>)/g)
}

function squashNewlines(data) {
  return data.replace(/\n/g, '')
}

function parseMarkdown(data) {
  return Promise.resolve(data)
  .then(fixNewLines)
  .then(removeComments)
  .then(parseHeaders)
  .then(parseHR)
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