const fs = require('fs');
const filter = require('./filter');
let doc = fs.readFileSync('./danger.xml').toString();

let filtered = filter(doc);

let pass = null==filtered.match(/Shit/);
console.log(`pass=${pass}`);

process.exit(!pass);
