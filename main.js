const lang = 'de'

const feedURLs = {
  International: 'https://news.google.com/news/rss/headlines/section/topic/WORLD?hl=' + lang,
  National: 'https://news.google.com/news/rss/headlines/section/topic/NATION?hl=' + lang,
  Berlin: 'https://news.google.com/news/rss/headlines/section/geo/Berlin?hl=' + lang
}

const blacklist = ['BILD', 'B.Z.', 'STERN']

document.querySelector('#blacklist').textContent = blacklist.slice(0, -1).join(', ') + ' und ' + blacklist.slice(-1)

const tokenFunctions = {}
tokenFunctions.typoString = function (entry, tokens, lc = lang) {
  return entry.title
    .replace(/ - FAZ( - Frankfurter Allgemeine Zeitung)/, '$1') // FAZ
    .replace(/"([^"]*)"/g, '„$1“') // Doppelte Anführungszeichen
    .replace(/(\w)'(\w)/g, '$1’$2') // Apostroph
    .replace(/'([^']*)'/g, '‚$1‘') // Einzelne Anführungszeichen
    .replace(/ - /g, ' – ') // Gedankenstrich
}
tokenFunctions.quelle = function (entry, tokens) {
  const typoString = tokens.typoString(entry, tokens)
  return typoString.split(' – ')[typoString.split(' – ').length - 1]
}
tokenFunctions.lead = function (entry, tokens) {
  const typoString = tokens.typoString(entry, tokens)
  console.log(typoString)
  if (typoString.includes(':') && typoString.indexOf(':') < typoString.indexOf(' – ')) {
    // Doppelpunkt zeigt Lead an
    if (typoString.includes(': ')) {
      return typoString.split(': ')[0]
    } else if (typoString.includes(':')) {
      return typoString.split(':')[0]
    }
  } else if ((typoString.match(/ – /g) || []).length > 1) {
    // Gedankenstrich zeigt Lead an
    return typoString.substring(0, typoString.indexOf(' – '))
  } else {
    // Kein Lead
    return ''
  }
}
tokenFunctions.schlagzeile = function (entry, tokens) {
  const typoString = tokens.typoString(entry, tokens)
  const lead = tokens.lead(entry, tokens)
  const quelle = tokens.quelle(entry, tokens)
  return typoString
    .substring(
      typoString.indexOf(lead) + lead.length,
      typoString.lastIndexOf(quelle) - 2
    )
    .replace(/^ ?[:\–'"]* ?/, '') // Doppelpunkt, Bindestrich, Anführungszeichen Leerzeichen am Anfang entfernen
    .replace(/ \| \w.*/, '') // Kategorien hinter senkrechtem Strich entfernen
}

for (const [edition, url] of Object.entries(feedURLs)) {
  new window.RSS(
    document.querySelector('#' + edition),
    url,
    {
      support: false,
      entryTemplate: document.querySelector('#entry-template').innerHTML,
      layoutTemplate: document.querySelector('#layout-template').innerHTML,
      tokens: tokenFunctions,
      // Get more entries to then filter
      limit: 10,
      filterLimit: 4,
      filter: function (entry, tokens) {
        return !blacklist.some(el => tokens.quelle(entry, tokens).includes(el))
      }
    }
  ).render()
  console.log('Rendered', url)
}
