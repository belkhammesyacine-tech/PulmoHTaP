const fs = require('fs');
const path = require('path');

const files = [
  'server/src/app.js',
  'server/prisma/schema.prisma',
  'server/src/features/appointments/appointments.service.js',
  'PROJECT_MAP.md'
];

files.forEach(file => {
  const p = path.join('c:/Users/SOFT/OneDrive/Bureau/PulmoHTaP4', file);
  if (fs.existsSync(p)) {
    const content = fs.readFileSync(p, 'utf8');
    // Replace conflict blocks with the content from HEAD
    const newContent = content.replace(/<<<<<<< HEAD\r?\n([\s\S]*?)=======\r?\n[\s\S]*?>>>>>>> [a-f0-9a-zA-Z]+\r?\n?/g, '$1');
    if (newContent !== content) {
      fs.writeFileSync(p, newContent, 'utf8');
      console.log(`Fixed ${file}`);
    } else {
      console.log(`No conflicts found in ${file}`);
    }
  } else {
    console.log(`File not found: ${file}`);
  }
});
