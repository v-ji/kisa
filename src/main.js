import './styles.css'
import RSS from 'vanilla-rss'
import { headliner } from './headliner.js'

window.RSS = RSS
window.headliner = headliner

function flag (country) {
  return country.toUpperCase().replace(/./g, char => String.fromCodePoint(char.charCodeAt(0) + 127397))
}

const kisaSettings = {
  lang: navigator.language.slice(0, 2).toLowerCase() || 'de',
  country: navigator.language.slice(3).toUpperCase() || 'DE',
  city: 'Berlin',
  set geo (data) {
    this.geoData = data
    this.country = data.country_code
    this.city = data.city
  },
  get geo () {
    return this.geoData
  }
}

window.fetch('https://get.geojs.io/v1/ip/geo.json')
  .then((res) => res.json())
  .then((data) => {
    kisaSettings.geo = data
    render()
  })
  .catch(() => {
    render()
  })

document.querySelector('#lang').addEventListener('change', render)
document.querySelector('#country').addEventListener('change', render)

const blacklist = ['BILD', 'B.Z.', 'STERN', 'merkur']

document.querySelector('#blacklist').textContent = blacklist.slice(0, -1).join(', ') + ' und ' + blacklist.slice(-1)

function render () {
  document.querySelector('#edition').textContent = flag(kisaSettings.country)

  const feedURLs = {
    international: 'https://news.google.com/news/rss/headlines/section/topic/WORLD?hl=' + kisaSettings.lang + '&gl=' + kisaSettings.country,
    national: 'https://news.google.com/news/rss/headlines/section/topic/NATION?hl=' + kisaSettings.lang + '&gl=' + kisaSettings.country,
    local: 'https://news.google.com/news/rss/headlines/section/geo/' + encodeURIComponent(kisaSettings.city) + '?hl=' + kisaSettings.lang + '&gl=' + kisaSettings.country
  }

  const tokenFunctions = {
    lead: (entry, tokens) => headliner(entry.title, kisaSettings.lang).lead,
    headline: (entry, tokens) => headliner(entry.title, kisaSettings.lang).headline,
    source: (entry, tokens) => headliner(entry.title, kisaSettings.lang).source,
    escapedTitle: (entry, tokens) => entry.title.replace(/"/g, '&quot;').replace(/'/g, '&#039;')
  }

  for (const [edition, url] of Object.entries(feedURLs)) {
    const editionHeaderElement = document.querySelector('h3.' + edition)
    const editionContentElement = document.querySelector('div.' + edition)
    editionContentElement.innerHTML = ''

    if (edition === 'local') {
      editionHeaderElement.title = kisaSettings.city
    }

    new RSS(
      editionContentElement,
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
