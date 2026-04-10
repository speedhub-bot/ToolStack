const fs = require('fs');

const jsMain = fs.readFileSync('js_main.txt', 'utf8');
const jsPart1 = fs.readFileSync('js_part1.txt', 'utf8');
const jsPart2 = fs.readFileSync('js_part2.txt', 'utf8');
const jsPart3 = fs.readFileSync('js_part3.txt', 'utf8');

const fullJs = `
${jsMain}
${jsPart1}
${jsPart2}
${jsPart3}
renderGrid();
`;

fs.writeFileSync('full.js', fullJs);
console.log('Created full.js');
