const fs = require('fs');

function unescapeFile(file) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/\\`/g, '`');
    content = content.replace(/\\\$/g, '$');
    content = content.replace(/\\\\/g, '\\');
    fs.writeFileSync(file, content);
}

unescapeFile('js_part1.txt');
unescapeFile('js_part2.txt');
unescapeFile('js_part3.txt');
console.log('Unescaped');
