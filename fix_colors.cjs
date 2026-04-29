const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/components/tools');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.tsx'));

const newColors = `colors={['#004b34', '#334155', '#94a3b8', '#e2e8f0']}`;

files.forEach((file) => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Regex to match colors={['#...', '#...', ...]}
  const newContent = content.replace(/colors=\{\[[^\]]+\]\}/g, newColors);

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Updated', file);
  }
});
