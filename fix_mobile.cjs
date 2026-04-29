const fs = require('fs');

const files = [
  './src/components/tools/StundensatzRechner.tsx',
  './src/components/tools/NebenkostenRechner.tsx',
  './src/components/tools/ElterngeldRechner.tsx',
  './src/components/tools/BruttoNettoRechner.tsx',
];

const oldClass =
  'mx-3 mb-3 rounded-[24px] border border-border/80 bg-surface-elevated px-4 py-4 shadow-[0_10px_28px_rgba(44,42,37,0.04)] sm:mx-4 sm:px-5';
const newClass =
  'mb-4 rounded-[24px] border border-border/80 bg-surface-elevated px-4 py-4 shadow-[0_10px_28px_rgba(44,42,37,0.04)] sm:px-5';

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  // Replace the squished classes
  content = content.replaceAll(oldClass, newClass);

  // Replace the button text
  content = content.replace(
    />\s*.*?als PDF \/ Druckansicht sichern\s*<\/button>/g,
    '>Ergebnis als PDF / Druckansicht sichern</button>'
  );

  fs.writeFileSync(file, content, 'utf8');
}
console.log('Fixed squished layouts and PDF CTA');
