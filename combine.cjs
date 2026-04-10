const fs = require('fs');
const JavaScriptObfuscator = require('javascript-obfuscator');

const html = fs.readFileSync('html.txt', 'utf8');
const css = fs.readFileSync('css.txt', 'utf8');
const jsMain = fs.readFileSync('js_main.txt', 'utf8');
const jsPart1 = fs.readFileSync('js_part1.txt', 'utf8');
const jsPart2 = fs.readFileSync('js_part2.txt', 'utf8');
const jsPart3 = fs.readFileSync('js_part3.txt', 'utf8');

const combinedJs = `${jsMain}\n${jsPart1}\n${jsPart2}\n${jsPart3}\nrenderGrid();`;

// Obfuscate the JavaScript to protect the source code
const obfuscationResult = JavaScriptObfuscator.obfuscate(combinedJs, {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: true,
    debugProtectionInterval: 4000,
    disableConsoleOutput: true,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    numbersToExpressions: true,
    renameGlobals: false,
    selfDefending: true,
    simplify: true,
    splitStrings: true,
    splitStringsChunkLength: 10,
    stringArray: true,
    stringArrayCallsTransform: true,
    stringArrayCallsTransformThreshold: 0.5,
    stringArrayEncoding: ['base64', 'rc4'],
    stringArrayIndexShift: true,
    stringArrayRotate: true,
    stringArrayShuffle: true,
    stringArrayWrappersCount: 1,
    stringArrayWrappersChainedCalls: true,
    stringArrayWrappersParametersMaxCount: 2,
    stringArrayWrappersType: 'variable',
    stringArrayThreshold: 0.75,
    unicodeEscapeSequence: false
});

const finalHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ToolStack — Student Utility Hub</title>
    <meta name="description" content="A futuristic, premium student utility hub with 30 fully functional tools. Free, fast, and no login required.">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>${css}</style>
</head>
<body oncontextmenu="return false;">
${html}
    <script>${obfuscationResult.getObfuscatedCode()}</script>
</body>
</html>`;

fs.writeFileSync('index.html', finalHtml);
console.log('Done');
