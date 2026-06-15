const fs = require('fs');
let c = fs.readFileSync('src/pages/LeaderboardPage.jsx','utf8');
c = c.replace(
  'import {\nimport { useLanguage } from \'@/lib/LanguageContext\';\n',
  'import { useLanguage } from \'@/lib/LanguageContext\';\nimport {\n'
);
fs.writeFileSync('src/pages/LeaderboardPage.jsx', c);
console.log('Fixed!');
