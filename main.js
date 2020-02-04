const tokenFunctions = {}

tokenFunctions.lead = function (entry, tokens) {
  if (entry.title.includes(': ')) {
    return entry.title.split(': ')[0]
  } else if (entry.title.includes(':')) {
    return entry.title.split(':')[0]
  } else {
    return ''
  }
}
tokenFunctions.quelle = function (entry, tokens) {
  return entry.title.split(' - ')[entry.title.split(' - ').length - 1]
}
tokenFunctions.schlagzeile = function (entry, tokens) {
  let leadPadding = 1
  const lead = tokens.lead(entry, tokens)
  if (lead.length === 0) {
    leadPadding = 0
  }
  const quelle = tokens.quelle(entry, tokens)
  return entry.title
    .substring(
      entry.title.indexOf(lead) + lead.length + leadPadding,
      entry.title.lastIndexOf(quelle) - 2
    )
}

const feedURLs = {
  International: 'https://news.google.com/news/rss/headlines/section/topic/WORLD?hl=de',
  National: 'https://news.google.com/news/rss/headlines/section/topic/NATION?hl=de',
  Berlin: 'https://news.google.com/news/rss/headlines/section/geo/Berlin?hl=de'
}

const blacklist = ['BILD', 'STERN']
document.querySelector('#blacklist').textContent = blacklist.join(', ')

for (const [edition, url] of Object.entries(feedURLs)) {
  new window.RSS(
    document.querySelector('#' + edition),
    url,
    {
      support: false,
      entryTemplate: document.querySelector('#entry-template').innerHTML,
      tokens: tokenFunctions,
      // Get more entries to then filter
      limit: 10,
      filterLimit: 4,
      filter: function (entry, tokens) {
        return !blacklist.some(el => tokens.quelle(entry, tokens).includes(el))
      }

    }
  ).render()
}
