const fs = require('fs');

const path = './src/lib/tool-content.ts';
let content = fs.readFileSync(path, 'utf8');

const replacements = {
  tragfaehiger: 'tragfähiger',
  fuer: 'für',
  koennen: 'können',
  Tatsaechtliche: 'Tatsächliche',
  noetigen: 'nötigen',
  'Buero-': 'Büro-',
  Bauchgefuehl: 'Bauchgefühl',
  veraendert: 'verändert',
  hoeher: 'höher',
  muessen: 'müssen',
  faellst: 'fällst',
  ueber: 'über',
  Ergaenze: 'Ergänze',
  pruefen: 'prüfen',
  schaetzt: 'schätzt',
  Schaetze: 'Schätze',
  Freibetraege: 'Freibeträge',
  Aenderungen: 'Änderungen',
  spuerbar: 'spürbar',
  beruecksichtigt: 'berücksichtigt',
  Sachbezuege: 'Sachbezüge',
  Hoehen: 'Höhen',
  hoehe: 'höhe',
  laengere: 'längere',
  Betraegen: 'Beträgen',
  waehlen: 'wählen',
  Flaeche: 'Fläche',
  schlaegt: 'schlägt',
  staerker: 'stärker',
  Waermepumpen: 'Wärmepumpen',
  koennte: 'könnte',
  hoechstens: 'höchstens',
  Fuer: 'Für',
  USt: 'USt',
  Mindeststundensatz: 'Mindeststundensatz',
  schaetzung: 'schätzung',
  Schaetzung: 'Schätzung',
  massgeblich: 'maßgeblich',
  erklaert: 'erklärt',
  laenger: 'länger',
  Hoehe: 'Höhe',
  Grundfreibetraege: 'Grundfreibeträge',
  Kinderfreibetraege: 'Kinderfreibeträge',
  Mindestbetraegen: 'Mindestbeträgen',
  Wohnflaeche: 'Wohnfläche',
  fakturierbaren: 'fakturierbaren',
  gaengigen: 'gängigen',
  Kirchensteuerhoehe: 'Kirchensteuerhöhe',
  Wahle: 'Wähle',
};

for (const [wrong, right] of Object.entries(replacements)) {
  const regex = new RegExp('\\b' + wrong + '\\b', 'g');
  content = content.replace(regex, right);
}

content = content.replace(/Buero-/g, 'Büro-');

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed umlaute in ' + path);
