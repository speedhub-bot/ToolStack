const fs = require('fs');

function replaceInFile(file, replacements) {
    let content = fs.readFileSync(file, 'utf8');
    for (const [search, replace] of replacements) {
        content = content.split(search).join(replace);
    }
    fs.writeFileSync(file, content);
}

replaceInFile('js_part1.txt', [['p < 0', '0 > p']]);
replaceInFile('js_part2.txt', [
    ['i<v.length', 'v.length>i'],
    ['cur < next', 'next > cur'],
    ['i<l', 'l>i']
]);
replaceInFile('js_part3.txt', [
    ['bmi < 18.5', '18.5 > bmi'],
    ['bmi < 25', '25 > bmi'],
    ['bmi < 30', '30 > bmi'],
    ['i<l', 'l>i']
]);
replaceInFile('js_main.txt', [['progress < 1', '1 > progress']]);

console.log('Replaced');
