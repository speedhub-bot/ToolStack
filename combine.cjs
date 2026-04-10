const fs = require('fs');
const html = fs.readFileSync('html.txt', 'utf8');
const css = fs.readFileSync('css.txt', 'utf8');
const jsMain = fs.readFileSync('js_main.txt', 'utf8');
const jsPart1 = fs.readFileSync('js_part1.txt', 'utf8');
const jsPart2 = fs.readFileSync('js_part2.txt', 'utf8');
const jsPart3 = fs.readFileSync('js_part3.txt', 'utf8');

const finalHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ToolStack — Student Utility Hub</title>
    <meta name="description" content="A futuristic, premium student utility hub with 30 fully functional tools. Free, fast, and no login required.">
    <meta property="og:title" content="ToolStack — Student Utility Hub">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
${css}
    </style>
</head>
<body>
${html}
    <script>
${jsMain}
${jsPart1}
${jsPart2}
${jsPart3}
renderGrid();
    </script>
</body>
</html>`;

fs.writeFileSync('index.html', finalHtml);
console.log('Done');
