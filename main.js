const kisaSettings = {
  userLanguage: navigator.language || navigator.userLanguage,
  get lang () {
    return this.userLanguage.slice(0, 2).toLowerCase() || 'de'
  },
  get country () {
    return this.geoIP.country.slice(0, 2).toUpperCase() || 'de'
  }
}

window.fetch('https://get.geojs.io/v1/ip/country.json')
  .then((res) => res.json())
  .then((data) => {
    kisaSettings.geoIP = data
  })
  .then(render())

document.querySelector('#lang').addEventListener('change', render)
document.querySelector('#country').addEventListener('change', render)

const blacklist = ['BILD', 'B.Z.', 'STERN', 'merkur']

document.querySelector('#blacklist').textContent = blacklist.slice(0, -1).join(', ') + ' und ' + blacklist.slice(-1)

function render () {
  const feedURLs = {
    International: 'https://news.google.com/news/rss/headlines/section/topic/WORLD?hl=' + kisaSettings.lang + '&gl=' + kisaSettings.country,
    National: 'https://news.google.com/news/rss/headlines/section/topic/NATION?hl=' + kisaSettings.lang + '&gl=' + kisaSettings.country,
    Berlin: 'https://news.google.com/news/rss/headlines/section/geo/Berlin?hl=' + kisaSettings.lang + '&gl=' + kisaSettings.country
  }

  const tokenFunctions = {
    lead: (entry, tokens) => window.headliner(entry.title, kisaSettings.lang).lead,
    headline: (entry, tokens) => window.headliner(entry.title, kisaSettings.lang).headline,
    source: (entry, tokens) => window.headliner(entry.title, kisaSettings.lang).source
  }

  for (const [edition, url] of Object.entries(feedURLs)) {
    document.querySelector('#' + edition).innerHTML = ''
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
          return !blacklist.some(el => tokens.source(entry, tokens).includes(el))
        }
      })
      .render()
      .then(
        () => {},
        (err) => {
          if (err) {
            console.error(err)
            document.querySelector('#' + edition).innerHTML = '<p>Feed konnte nicht geladen werden. Bitte prüfe deine Netzwerkverbindung.</p>'
          }
        }
      )
  }
}
