const fs = require('fs');
const path = 'index.html';
const content = fs.readFileSync(path, 'utf8');

const target = /const steps = \[\s*\{ text: `Pregunta: \$\{row\.question\}`, type: 'Q' \},\s*\{ text: row\.question, type: 'Q' \},\s*\{ text: `Respuesta: \$\{row\.answer\}`, type: 'A' \},\s*\{ text: row\.answer, type: 'A' \}\s*\];/;

const replacement = `const steps = [];
          for (let i = 0; i < audioRepeats; i++) {
            steps.push({ text: i === 0 ? \`Pregunta: \${row.question}\` : row.question, type: 'Q' });
          }
          for (let i = 0; i < audioRepeats; i++) {
            steps.push({ text: i === 0 ? \`Respuesta: \${row.answer}\` : row.answer, type: 'A' });
          }`;

if (target.test(content)) {
    const newContent = content.replace(target, replacement);
    fs.writeFileSync(path, newContent, 'utf8');
    console.log('Successfully updated steps logic.');
} else {
    console.log('Target steps block not found.');
}
