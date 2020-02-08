function headliner (string, langCode) {
  const components = {
    lead: '',
    headline: '',
    source: ''
  }

  let typo // Typografischer Titel
  typo = string
    .replace(/ - F\.?A\.?Z\.?( - Frankfurter Allgemeine Zeitung)/, '$1') // FAZ
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
  }

  [this.typoWithoutSource, , components.source] = typo.split(/( – )(?!.*\1)/) // Matcht letzten Gedankenstrich im String

  if (this.typoWithoutSource.includes(':') || this.typoWithoutSource.includes(' – ')) {
    // Erster Doppelpunkt oder Gedankenstrich zeigt Lead an
    [components.lead, , components.headline] = this.typoWithoutSource.split(/(: ?| – )/)
  } else {
    // Kein Lead
    components.lead = ''
    components.headline = this.typoWithoutSource
  }

  components.headline = components.headline
    .replace(/ \| \w.*/, '') // Kategorien hinter senkrechtem Strich entfernen
  components.headline = components.headline.slice(0, 1).toLocaleUpperCase() + components.headline.slice(1)
  return components
}

function testHeadliner () {
  document.querySelectorAll('.headline').forEach(x => console.debug(headliner(x.parentNode.title)))
}
