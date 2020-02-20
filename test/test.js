import { headliner } from '../src/headliner.js'
const assert = require('assert')

describe('headliner()', function () {
  const tests = [{
    case: 'colon with space',
    lang: 'de',
    input: 'Vor Sondergipfel: Italien lehnt EU-Haushaltspläne ab - DER SPIEGEL',
    expected: {
      lead: 'Vor Sondergipfel',
      headline: 'Italien lehnt EU-Haushaltspläne ab',
      source: 'DER SPIEGEL'
    }
  },
  {
    case: 'colon without space',
    lang: 'de',
    input: 'Am Putsch in Türkei beteiligt?:Intellektueller Kavala erneut inhaftiert - n-tv NACHRICHTEN',
    expected: {
      lead: 'Am Putsch in Türkei beteiligt?',
      headline: 'Intellektueller Kavala erneut inhaftiert',
      source: 'n-tv NACHRICHTEN'
    }
  },
  {
    case: 'colon surrounded by spaces',
    lang: 'de',
    input: 'Erkältungszeit : Öffentliche Verkehrsmittel sind Berlins größte Keimschleudern - Berliner Zeitung',
    expected: {
      lead: 'Erkältungszeit ',
      headline: 'Öffentliche Verkehrsmittel sind Berlins größte Keimschleudern',
      source: 'Berliner Zeitung'
    }
  },
  {
    case: 'liveticker with timestamp and +++',
    lang: 'de',
    input: 'Liveticker zu Hanau:+++ 13:21 Botschaft: Fünf Türken unter den Opfern +++ - n-tv NACHRICHTEN',
    expected: {
      lead: 'Liveticker zu Hanau',
      headline: '13:21 Botschaft: Fünf Türken unter den Opfern ',
      source: 'n-tv NACHRICHTEN'
    }
  },
  {
    case: 'F.A.Z. without lead',
    lang: 'de',
    input: 'Innenminister gehen von rechtsradikalem Hintergrund aus - F.A.Z. - Frankfurter Allgemeine Zeitung',
    expected: {
      lead: '',
      headline: 'Innenminister gehen von rechtsradikalem Hintergrund aus',
      source: 'Frankfurter Allgemeine Zeitung'
    }
  },
  {
    case: 'typographic quote transformation',
    lang: 'de',
    input: 'Anschlag in Hanau - Generalbundesanwalt bestätigt eine "zutiefst rassistische Gesinnung" - Süddeutsche Zeitung',
    expected: {
      lead: 'Anschlag in Hanau',
      headline: 'Generalbundesanwalt bestätigt eine „zutiefst rassistische Gesinnung“',
      source: 'Süddeutsche Zeitung'
    }
  }]

  tests.forEach(function (test) {
    it('[' + test.lang + '] ' + 'correctly handles ' + test.case, function () {
      const res = headliner(test.input, test.lang)
      const shortened = {
        lead: res.lead,
        headline: res.headline,
        source: res.source
      }
      assert.deepStrictEqual(shortened, test.expected)
    })
  })
})
