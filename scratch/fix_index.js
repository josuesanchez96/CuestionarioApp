const fs = require('fs');
const path = 'index.html';
let content = fs.readFileSync(path, 'utf8');

// Fix the corrupted loadingFile/Hub area
content = content.replace(/<span classNa\s+{loadingFile && \(/, '<span className="hub-desc">Audio Estudio Pro (3x3x3)</span>\n                    </button>\n                  </div>\n                </section>\n              )}\n\n              {loadingFile && (');

// Fix the corrupted button styles and duplication at the end
content = content.replace(/style={{ color: 'rgba\(255,255,255,0.15\)', border: 'none\s+<div className="audio-card"/, "style={{ color: 'rgba(255,255,255,0.15)', border: 'none', background: 'transparent', WebkitTapHighlightColor: 'transparent', outline: 'none' }}>Salir ⛌</button>\n                  </div>\n\n                  <div className=\"audio-card\"");

// Remove the garbage duplication after the card
const garbage = /<\/div>value\)\)\}\s+style={{ width: '100%', height: '4px', opacity: 0\.2 }} \/>\s+<\/div>\s+<\/div>\s+<\/div>\s+<\/div>\s+<\/div>/g;
content = content.replace(garbage, '</div>');

// Ensure the heart button click works and has stopPropagation
// (It's already in the code, but let's make sure it's clean)

fs.writeFileSync(path, content, 'utf8');
console.log('File cleaned successfully');
