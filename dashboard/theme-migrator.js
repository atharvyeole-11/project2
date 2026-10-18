import fs from 'fs';
import path from 'path';

const directory = './frontend';

const replacements = [
  // Backgrounds
  { from: /bg-slate-950/g, to: 'bg-slate-50' },
  { from: /bg-slate-900\/80/g, to: 'bg-white' },
  { from: /bg-slate-900/g, to: 'bg-white' },
  { from: /bg-slate-800\/80/g, to: 'bg-slate-100' },
  { from: /bg-slate-800\/60/g, to: 'bg-slate-50' },
  { from: /bg-slate-800\/40/g, to: 'bg-slate-50' },
  { from: /bg-slate-800/g, to: 'bg-slate-100' },
  
  // Borders
  { from: /border-slate-800\/60/g, to: 'border-slate-200' },
  { from: /border-slate-800/g, to: 'border-slate-200' },
  { from: /border-slate-700/g, to: 'border-slate-300' },

  // Text Colors
  { from: /text-slate-100/g, to: 'text-slate-900' },
  { from: /text-slate-200/g, to: 'text-slate-800' },
  { from: /text-slate-300/g, to: 'text-slate-700' },
  { from: /text-slate-400/g, to: 'text-slate-500' },

  // Accents (Cyan -> Blue)
  { from: /text-cyan-400/g, to: 'text-blue-600' },
  { from: /text-cyan-300/g, to: 'text-blue-500' },
  { from: /bg-cyan-500\/10/g, to: 'bg-blue-50' },
  { from: /bg-cyan-500\/20/g, to: 'bg-blue-100' },
  { from: /border-cyan-500\/20/g, to: 'border-blue-200' },
  { from: /border-cyan-500\/30/g, to: 'border-blue-300' },
  { from: /bg-cyan-500/g, to: 'bg-blue-600' },
  { from: /hover:bg-cyan-400/g, to: 'hover:bg-blue-500' },
  { from: /hover:text-cyan-300/g, to: 'hover:text-blue-500' },
  { from: /ring-cyan-500/g, to: 'ring-blue-600' },
  { from: /text-cyan-600/g, to: 'text-blue-600' },
  { from: /hover:text-cyan-700/g, to: 'hover:text-blue-700' },
  { from: /shadow-cyan-500\/20/g, to: 'shadow-blue-600\/20' },
  { from: /shadow-cyan-500\/25/g, to: 'shadow-blue-600\/25' },
  { from: /shadow-cyan-500\/30/g, to: 'shadow-blue-600\/30' },
  { from: /accent-cyan-500/g, to: 'accent-blue-600' },
  { from: /border-cyan-500/g, to: 'border-blue-600' },
  { from: /text-slate-950/g, to: 'text-white' }, // Buttons usually have text-slate-950 on cyan-500, now it's white on blue-600
];

function replaceInFile(filePath) {
  const ext = path.extname(filePath);
  if (!['.jsx', '.js', '.html'].includes(ext)) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;

  replacements.forEach(rep => {
    newContent = newContent.replace(rep.from, rep.to);
  });

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent);
    console.log(`Updated ${filePath}`);
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist') {
        processDirectory(fullPath);
      }
    } else {
      replaceInFile(fullPath);
    }
  });
}

processDirectory(directory);
console.log('Theme replacement complete.');
