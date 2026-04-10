const fs = require('fs');

let part1 = fs.readFileSync('js_part1.txt', 'utf8');
part1 = part1.replace(/<script>[\s\S]*?<\/script>/g, '');
fs.writeFileSync('js_part1.txt', part1);

let part2 = fs.readFileSync('js_part2.txt', 'utf8');
part2 = part2.replace(/<script>[\s\S]*?<\/script>/g, '');
fs.writeFileSync('js_part2.txt', part2);

let main = fs.readFileSync('js_main.txt', 'utf8');
main += `
// Global functions for tools
window.addSubject = function() {
    const div = document.createElement('div');
    div.className = 'flex-row mb-2';
    div.innerHTML = '<div class="input-group"><input type="number" placeholder="Credits" class="cgpa_c"></div><div class="input-group"><input type="number" placeholder="Grade Point" class="cgpa_g"></div>';
    document.getElementById('cgpa_subjects').appendChild(div);
};

window.addSem = function() {
    const div = document.createElement('div');
    div.className = 'flex-row mb-2';
    div.innerHTML = '<div class="input-group"><input type="number" placeholder="Sem Credits" class="sgpa_c"></div><div class="input-group"><input type="number" placeholder="SGPA" class="sgpa_g"></div>';
    document.getElementById('sgpa_list').appendChild(div);
};

window.pomoInt = null;
window.startPomo = function() {
    let t = 25 * 60;
    clearInterval(window.pomoInt);
    window.pomoInt = setInterval(() => {
        t--;
        const m = Math.floor(t/60).toString().padStart(2,'0');
        const s = (t%60).toString().padStart(2,'0');
        document.getElementById('pomo_display').innerText = m+':'+s;
        if(t<=0) { clearInterval(window.pomoInt); alert('Time up!'); }
    }, 1000);
};
window.stopPomo = function() { clearInterval(window.pomoInt); };
`;
fs.writeFileSync('js_main.txt', main);

console.log('Fixed scripts');
