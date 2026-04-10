const fs = require('fs');

function replaceInFile(file, replacements) {
    let content = fs.readFileSync(file, 'utf8');
    for (const [search, replace] of replacements) {
        content = content.split(search).join(replace);
    }
    fs.writeFileSync(file, content);
}

replaceInFile('js_part2.txt', [
    ['?><,', '?>\\x3C,']
]);

console.log('Replaced');
