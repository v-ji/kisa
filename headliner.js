function headliner (string, langCode) {
  const components = {
    interim: {},
    lead: '',
    headline: '',
    source: ''
  }

  let typo // Typografischer Titel
  typo = string
    .replace(/ - F\.?A\.?Z\.?( - Frankfurter Allgemeine Zeitung)/, '$1') // FAZ
    .replace(/\+\++ ?/g, ' ') // +++ Ticker +++
    .replace(/(\w)'(\w)/g, '$1’$2') // Apostroph
    .replace(/ - /g, ' – ') // Gedankenstrich

  if (langCode === 'de') {
    typo = typo
      .replace(/"([^"]*)"/g, '„$1“') // Doppelte Anführungszeichen
      .replace(/'([^']*)'/g, '‚$1‘') // Einzelne Anführungszeichen
  } else if (langCode === 'en') {
    typo = typo
      .replace(/"([^"]*)"/g, '“$1”') // Doppelte Anführungszeichen
      .replace(/'([^']*)'/g, '‘$1’') // Einzelne Anführungszeichen
  } else if (langCode === 'fr') {
    typo = typo
      .replace(/"([^"]*)"/g, '«$1»') // Doppelte Anführungszeichen
      .replace(/'([^']*)'/g, '‹$1›') // Einzelne Anführungszeichen
  }

  ;[components.interim.sourceRemoved, , components.source] = typo.split(/( – )(?!.*\1)/) // Matcht letzten Gedankenstrich im String
  if (components.interim.sourceRemoved.includes(':') || components.interim.sourceRemoved.includes(' – ')) {
    // Erster Doppelpunkt oder Gedankenstrich zeigt Lead an
    // Uhrzeit extrahieren
    components.interim.timeReplaced = components.interim.sourceRemoved.replace(/(\d{2}):(\d{2})/g, '$1{TIME_COLON}$2')
    components.interim.leadHeadlineSplit = components.interim.timeReplaced
      .split(/(: | – )/)
      .map(x => x.replace('{TIME_COLON}', ':'))

    if (components.interim.leadHeadlineSplit.length >= 3) {
      components.lead = components.interim.leadHeadlineSplit.slice(0, 1)
      components.headline = components.interim.leadHeadlineSplit.slice(2)
    } else {
      components.lead = ''
      components.headline = components.interim.sourceRemoved
    }
  } else {
    // Kein Lead
    components.lead = ''
    components.headline = components.interim.sourceRemoved
  }

  components.headline = components.headline
    .replace(/ \| \w.*/, '') // Kategorien hinter senkrechtem Strich entfernen
  components.headline = components.headline.slice(0, 1).toLocaleUpperCase() + components.headline.slice(1)
  return components
}

function testHeadliner () {
  document.querySelectorAll('.headline').forEach(x => console.debug(headliner(x.parentNode.title)))
}
