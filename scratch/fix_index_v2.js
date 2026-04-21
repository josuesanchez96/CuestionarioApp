const fs = require('fs');
const path = 'index.html';
let content = fs.readFileSync(path, 'utf8');

// Fix the corrupted loadingFile/Hub area (if it's still broken)
// ... but previous view showed it's okay now.

// Remove the garbage duplication after the card
// We look for the closing div of the color container, then the garbage ending with value))} style...
// Then we find the start of the next module.
const garbageRegex = /<\/div>\s+<\/div>\s+<\/div>value\)\)\}\s+style=\{\{ width: '100%', height: '4px', opacity: 0\.2 \}\} \/>[\s\S]*?{gameStarted && !gameOver && gameMode === 'module7'/;

if (garbageRegex.test(content)) {
    content = content.replace(garbageRegex, '</div>\n                  </div>\n                </div>\n              )}\n\n              {gameStarted && !gameOver && gameMode === 'module7');
    console.log('Garbage removed');
} else {
    console.log('Garbage regex did not match');
}

// Remove onDoubleClick from audio-card
content = content.replace(/<div className="audio-card"\s+onDoubleClick=\{[\s\S]*?\}\s+style=\{\{/, '<div className="audio-card"\n                       style={{');

fs.writeFileSync(path, content, 'utf8');
console.log('File processing complete');
