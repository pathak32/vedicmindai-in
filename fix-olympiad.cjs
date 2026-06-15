const fs = require('fs');
let c = fs.readFileSync('src/pages/OlympiadPage.jsx','utf8');
c = c.replace(
  'import {\nimport { useLanguage } from \'@/lib/LanguageContext\';\n',
  'import { useLanguage } from \'@/lib/LanguageContext\';\nimport {\n'
);
fs.writeFileSync('src/pages/OlympiadPage.jsx', c);
console.log('Fixed!');
