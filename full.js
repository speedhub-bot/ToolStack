
// UI Logic
const tools = []; // Will be populated by parts

// Cursor
const cursor = document.getElementById('cursorGlow');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Navbar & Back to top
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
    
    if (window.scrollY > 300) backToTop.classList.add('visible');
    else backToTop.classList.remove('visible');
});
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Hero Title Animation
const title = document.getElementById('heroTitle');
const text = title.innerText;
title.innerHTML = '';
text.split('').forEach((char, i) => {
    const span = document.createElement('span');
    span.innerText = char === ' ' ? '\u00A0' : char;
    span.style.animationDelay = (i * 0.05) + 's';
    title.appendChild(span);
});

// Toast
function showToast(msg) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = msg;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Modal
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const resultBox = document.getElementById('resultBox');
const resultValue = document.getElementById('resultValue');
const resultExtra = document.getElementById('resultExtra');
const copyBtn = document.getElementById('copyResultBtn');
let currentTool = null;

function openModal(toolId) {
    const tool = tools.find(t => t.id === toolId);
    if (!tool) return;
    currentTool = tool;
    modalTitle.innerHTML = `<span class="tool-icon">${tool.icon}</span> ${tool.name}`;
    modalBody.innerHTML = tool.renderForm();
    resultBox.classList.remove('active');
    
    const calcBtn = document.createElement('button');
    calcBtn.className = 'calc-btn';
    calcBtn.innerText = 'Calculate';
    calcBtn.onclick = () => {
        try {
            const res = tool.calculate();
            if (res) {
                resultExtra.innerText = res.label || '';
                animateValue(resultValue, 0, res.value, 1000, res.isString);
                resultBox.classList.add('active');
            }
        } catch (e) {
            showToast(e.message || 'Error in calculation');
        }
    };
    modalBody.appendChild(calcBtn);
    
    // Add custom listeners if any
    if(tool.onLoad) tool.onLoad();

    modalOverlay.classList.add('active');
}

modalClose.onclick = () => {
    modalOverlay.classList.remove('active');
    if(currentTool && currentTool.onClose) currentTool.onClose();
};
modalOverlay.onclick = (e) => {
    if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
        if(currentTool && currentTool.onClose) currentTool.onClose();
    }
};

copyBtn.onclick = () => {
    navigator.clipboard.writeText(resultValue.innerText);
    showToast('Result copied!');
};

// Animate Value
function animateValue(obj, start, end, duration, isString) {
    if (isString) {
        obj.innerHTML = end;
        return;
    }
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = progress * (end - start) + start;
        obj.innerHTML = Number.isInteger(end) ? Math.floor(current) : current.toFixed(2);
        if (1 > progress) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = end;
        }
    };
    window.requestAnimationFrame(step);
}

// Render Grid
const grid = document.getElementById('toolsGrid');
function renderGrid(filterText = '', category = 'all') {
    grid.innerHTML = '';
    let count = 0;
    tools.forEach((tool, i) => {
        if (category !== 'all' && tool.category !== category) return;
        if (filterText && !tool.name.toLowerCase().includes(filterText.toLowerCase()) && !tool.desc.toLowerCase().includes(filterText.toLowerCase())) return;
        
        count++;
        const card = document.createElement('div');
        card.className = 'tool-card';
        card.style.animationDelay = (i * 0.05) + 's';
        card.innerHTML = `
            ${tool.isNew ? '<div class="badge-new">NEW</div>' : ''}
            <div class="tool-icon">${tool.icon}</div>
            <div class="tool-name">${tool.name}</div>
            <div class="tool-desc">${tool.desc}</div>
            <button class="tool-btn" onclick="openModal('${tool.id}')">Open Tool →</button>
        `;
        grid.appendChild(card);
    });
    if (count === 0) {
        grid.innerHTML = '<div class="no-results">No tool found — suggest one?</div>';
    }
}

// Search & Filter
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
let currentCategory = 'all';

searchInput.addEventListener('input', (e) => renderGrid(e.target.value, currentCategory));

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.filter;
        renderGrid(searchInput.value, currentCategory);
    });
});

// Favicon Trick
const canvas = document.createElement('canvas');
canvas.height = 64;
canvas.width = 64;
const ctx = canvas.getContext('2d');
ctx.font = '48px serif';
ctx.fillText('⚡', 8, 48);
const link = document.createElement('link');
link.rel = 'icon';
link.href = canvas.toDataURL();
document.head.appendChild(link);

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

tools.push(
    {
        id: 'cgpa', name: 'CGPA Calculator', icon: '🎓', category: 'academic', desc: 'Calculate CGPA based on credits and grades.',
        renderForm: () => `
            <div class="input-group">
                <label>University Scale</label>
                <select id="cgpa_scale"><option value="10">10 Point Scale</option><option value="4">4.0 Scale</option></select>
            </div>
            <div id="cgpa_subjects">
                <div class="flex-row mb-2">
                    <div class="input-group"><input type="number" placeholder="Credits" class="cgpa_c"></div>
                    <div class="input-group"><input type="number" placeholder="Grade Point" class="cgpa_g"></div>
                </div>
            </div>
            <button class="tool-btn" onclick="addSubject()" style="width:100%; margin-bottom:15px;">+ Add Subject</button>
            
        `,
        calculate: () => {
            const credits = Array.from(document.querySelectorAll('.cgpa_c')).map(i => parseFloat(i.value) || 0);
            const grades = Array.from(document.querySelectorAll('.cgpa_g')).map(i => parseFloat(i.value) || 0);
            let totalC = 0, totalG = 0;
            credits.forEach((c, i) => { totalC += c; totalG += c * grades[i]; });
            if(totalC === 0) throw new Error("Enter credits");
            const cgpa = totalG / totalC;
            return { value: cgpa, label: 'Your CGPA is', isString: false };
        }
    },
    {
        id: 'attendance', name: 'Attendance Calculator', icon: '📅', category: 'academic', desc: 'Check if you are safe to bunk.',
        renderForm: () => `
            <div class="input-group"><label>Total Classes Conducted</label><input type="number" id="att_total"></div>
            <div class="input-group"><label>Classes Attended</label><input type="number" id="att_attended"></div>
            <div class="input-group"><label>Target %</label><input type="number" id="att_target" value="75"></div>
        `,
        calculate: () => {
            const total = parseFloat(document.getElementById('att_total').value);
            const attended = parseFloat(document.getElementById('att_attended').value);
            const target = parseFloat(document.getElementById('att_target').value);
            if(!total || !attended) throw new Error("Invalid inputs");
            const current = (attended / total) * 100;
            let msg = `Current: ${current.toFixed(2)}%<br>`;
            if (current >= target) {
                const canMiss = Math.floor(attended / (target/100) - total);
                msg += `<span style="color:var(--secondary)">You can miss ${canMiss} more classes safely.</span>`;
            } else {
                const need = Math.ceil((target * total - 100 * attended) / (100 - target));
                msg += `<span style="color:#ef4444">You need to attend ${need} more classes.</span>`;
            }
            return { value: msg, label: 'Attendance Status', isString: true };
        }
    },
    {
        id: 'grade_needed', name: 'Grade Needed', icon: '🎯', category: 'academic', desc: 'Find out what you need in finals.',
        renderForm: () => `
            <div class="input-group"><label>Current Marks</label><input type="number" id="gn_current"></div>
            <div class="input-group"><label>Total Marks So Far</label><input type="number" id="gn_total"></div>
            <div class="input-group"><label>Target Overall %</label><input type="number" id="gn_target"></div>
            <div class="input-group"><label>Remaining Marks</label><input type="number" id="gn_rem"></div>
        `,
        calculate: () => {
            const c = parseFloat(document.getElementById('gn_current').value);
            const t = parseFloat(document.getElementById('gn_total').value);
            const target = parseFloat(document.getElementById('gn_target').value);
            const r = parseFloat(document.getElementById('gn_rem').value);
            const required = ((target / 100) * (t + r)) - c;
            return { value: required, label: `Marks needed out of ${r}`, isString: false };
        }
    },
    {
        id: 'sgpa_cgpa', name: 'SGPA to CGPA', icon: '📊', category: 'academic', desc: 'Combine multiple semesters.',
        renderForm: () => `
            <div id="sgpa_list">
                <div class="flex-row mb-2">
                    <div class="input-group"><input type="number" placeholder="Sem Credits" class="sgpa_c"></div>
                    <div class="input-group"><input type="number" placeholder="SGPA" class="sgpa_g"></div>
                </div>
            </div>
            <button class="tool-btn" onclick="addSem()" style="width:100%; margin-bottom:15px;">+ Add Semester</button>
            
        `,
        calculate: () => {
            const credits = Array.from(document.querySelectorAll('.sgpa_c')).map(i => parseFloat(i.value) || 0);
            const sgpas = Array.from(document.querySelectorAll('.sgpa_g')).map(i => parseFloat(i.value) || 0);
            let tc = 0, tg = 0;
            credits.forEach((c, i) => { tc += c; tg += c * sgpas[i]; });
            if(tc === 0) throw new Error("Enter credits");
            return { value: tg / tc, label: 'Overall CGPA', isString: false };
        }
    },
    {
        id: 'pct_gpa', name: 'Percentage to GPA', icon: '🔄', category: 'academic', desc: 'Convert % to 4.0 or 10.0 scale.',
        renderForm: () => `
            <div class="input-group"><label>Percentage (%)</label><input type="number" id="pg_pct"></div>
            <div class="input-group"><label>Target Scale</label><select id="pg_scale"><option value="4">4.0 Scale</option><option value="10">10.0 Scale</option></select></div>
        `,
        calculate: () => {
            const p = parseFloat(document.getElementById('pg_pct').value);
            const s = parseFloat(document.getElementById('pg_scale').value);
            if(0 > p || p > 100) throw new Error("Invalid %");
            const res = s === 4 ? (p / 100) * 4 : (p / 9.5); // common Indian formula for 10 scale
            return { value: res, label: `GPA on ${s} scale`, isString: false };
        }
    },
    {
        id: 'pct_calc', name: 'Percentage Calc', icon: '➗', category: 'math', desc: 'Calculate percentages easily.',
        renderForm: () => `
            <div class="input-group"><label>Mode</label>
            <select id="pc_mode">
                <option value="1">X% of Y</option>
                <option value="2">X is what % of Y</option>
                <option value="3">% Increase/Decrease from X to Y</option>
            </select></div>
            <div class="input-group"><label>Value X</label><input type="number" id="pc_x"></div>
            <div class="input-group"><label>Value Y</label><input type="number" id="pc_y"></div>
        `,
        calculate: () => {
            const m = document.getElementById('pc_mode').value;
            const x = parseFloat(document.getElementById('pc_x').value);
            const y = parseFloat(document.getElementById('pc_y').value);
            let res = 0, lbl = '';
            if(m==='1') { res = (x/100)*y; lbl = `${x}% of ${y}`; }
            if(m==='2') { res = (x/y)*100; lbl = `${x} is % of ${y}`; }
            if(m==='3') { res = ((y-x)/x)*100; lbl = `% change`; }
            return { value: res, label: lbl, isString: false };
        }
    },
    {
        id: 'interest', name: 'Interest Calculator', icon: '📈', category: 'math', desc: 'Simple & Compound Interest.',
        renderForm: () => `
            <div class="input-group"><label>Principal (P)</label><input type="number" id="in_p"></div>
            <div class="input-group"><label>Rate % (R)</label><input type="number" id="in_r"></div>
            <div class="input-group"><label>Time in Years (T)</label><input type="number" id="in_t"></div>
        `,
        calculate: () => {
            const p = parseFloat(document.getElementById('in_p').value);
            const r = parseFloat(document.getElementById('in_r').value);
            const t = parseFloat(document.getElementById('in_t').value);
            const si = (p*r*t)/100;
            const ci = p * Math.pow((1 + r/100), t) - p;
            return { value: `SI: ${si.toFixed(2)}<br>CI: ${ci.toFixed(2)}`, label: 'Interest Earned', isString: true };
        }
    },
    {
        id: 'age', name: 'Age Calculator', icon: '🎂', category: 'math', desc: 'Exact age and next birthday.',
        renderForm: () => `
            <div class="input-group"><label>Date of Birth</label><input type="date" id="ag_dob"></div>
        `,
        calculate: () => {
            const dob = new Date(document.getElementById('ag_dob').value);
            const diff = Date.now() - dob.getTime();
            const ageDate = new Date(diff);
            const y = Math.abs(ageDate.getUTCFullYear() - 1970);
            return { value: `${y} Years`, label: 'Your exact age', isString: true };
        }
    },
    {
        id: 'date_diff', name: 'Date Difference', icon: '🗓️', category: 'math', desc: 'Days between two dates.',
        renderForm: () => `
            <div class="input-group"><label>Start Date</label><input type="date" id="dd_start"></div>
            <div class="input-group"><label>End Date</label><input type="date" id="dd_end"></div>
        `,
        calculate: () => {
            const d1 = new Date(document.getElementById('dd_start').value);
            const d2 = new Date(document.getElementById('dd_end').value);
            const diffTime = Math.abs(d2 - d1);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return { value: diffDays, label: 'Days difference', isString: false };
        }
    },
    {
        id: 'unit_conv', name: 'Unit Converter', icon: '📏', category: 'math', desc: 'Length, weight, temp.',
        renderForm: () => `
            <div class="input-group"><label>Value</label><input type="number" id="uc_val"></div>
            <div class="flex-row">
                <div class="input-group"><select id="uc_from"><option value="km">Km</option><option value="m">Meter</option><option value="mi">Miles</option></select></div>
                <div class="input-group"><select id="uc_to"><option value="km">Km</option><option value="m">Meter</option><option value="mi">Miles</option></select></div>
            </div>
        `,
        calculate: () => {
            const v = parseFloat(document.getElementById('uc_val').value);
            const f = document.getElementById('uc_from').value;
            const t = document.getElementById('uc_to').value;
            let m = v;
            if(f==='km') m = v*1000; if(f==='mi') m = v*1609.34;
            let res = m;
            if(t==='km') res = m/1000; if(t==='mi') res = m/1609.34;
            return { value: res, label: 'Converted Value', isString: false };
        }
    }
);

tools.push(
    {
        id: 'num_sys', name: 'Number System', icon: '🔢', category: 'math', desc: 'Binary, Hex, Decimal.',
        renderForm: () => `
            <div class="input-group"><label>Value</label><input type="text" id="ns_val"></div>
            <div class="flex-row">
                <div class="input-group"><label>From</label><select id="ns_from"><option value="10">Decimal</option><option value="2">Binary</option><option value="16">Hex</option></select></div>
                <div class="input-group"><label>To</label><select id="ns_to"><option value="10">Decimal</option><option value="2">Binary</option><option value="16">Hex</option></select></div>
            </div>
        `,
        calculate: () => {
            const v = document.getElementById('ns_val').value;
            const f = parseInt(document.getElementById('ns_from').value);
            const t = parseInt(document.getElementById('ns_to').value);
            const dec = parseInt(v, f);
            if(isNaN(dec)) throw new Error("Invalid input for base");
            return { value: dec.toString(t).toUpperCase(), label: 'Result', isString: true };
        }
    },
    {
        id: 'roman', name: 'Roman Numerals', icon: '🏛️', category: 'math', desc: 'Number ↔ Roman.',
        renderForm: () => `
            <div class="input-group"><label>Value (Number or Roman)</label><input type="text" id="rm_val"></div>
        `,
        calculate: () => {
            const v = document.getElementById('rm_val').value.toUpperCase();
            if(!isNaN(v)) {
                let num = parseInt(v);
                const lookup = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
                let roman = '';
                for (let i in lookup) {
                    while (num >= lookup[i]) { roman += i; num -= lookup[i]; }
                }
                return { value: roman, label: 'Roman Numeral', isString: true };
            } else {
                const romanToInt = {I:1,V:5,X:10,L:50,C:100,D:500,M:1000};
                let num = 0;
                for(let i=0; v.length>i; i++) {
                    const cur = romanToInt[v[i]], next = romanToInt[v[i+1]];
                    if(next && next > cur) { num += next - cur; i++; }
                    else num += cur;
                }
                return { value: num, label: 'Integer Value', isString: false };
            }
        }
    },
    {
        id: 'pomodoro', name: 'Pomodoro Timer', icon: '🍅', category: 'productivity', desc: 'Focus timer with alerts.',
        renderForm: () => `
            <div class="pomodoro-circle" id="pomo_display">25:00</div>
            <div class="flex-row">
                <button class="tool-btn" onclick="startPomo()" style="flex:1; margin-right:10px;">Start</button>
                <button class="tool-btn" onclick="stopPomo()" style="flex:1; background:var(--surface)">Stop</button>
            </div>
            
        `,
        calculate: () => { return { value: 'Timer running...', label: 'Status', isString: true }; },
        onClose: () => { if(window.pomoInt) clearInterval(window.pomoInt); }
    },
    {
        id: 'word_count', name: 'Word Counter', icon: '📝', category: 'productivity', desc: 'Count words, chars, paras.',
        renderForm: () => `
            <div class="input-group"><label>Text</label><textarea id="wc_text" rows="5" style="width:100%; background:var(--surface); border:1px solid var(--border); color:var(--text); padding:12px; border-radius:8px;"></textarea></div>
        `,
        calculate: () => {
            const t = document.getElementById('wc_text').value;
            const words = t.trim().split(/\s+/).filter(w=>w.length>0).length;
            const chars = t.length;
            return { value: `Words: ${words} | Chars: ${chars}`, label: 'Count', isString: true };
        }
    },
    {
        id: 'read_speed', name: 'Reading Speed', icon: '📖', category: 'productivity', desc: 'Estimate reading time.',
        renderForm: () => `
            <div class="input-group"><label>Text or Word Count</label><textarea id="rs_text" rows="4" style="width:100%; background:var(--surface); border:1px solid var(--border); color:var(--text); padding:12px; border-radius:8px;"></textarea></div>
            <div class="input-group"><label>Speed (WPM)</label><input type="number" id="rs_wpm" value="200"></div>
        `,
        calculate: () => {
            const t = document.getElementById('rs_text').value;
            const wpm = parseFloat(document.getElementById('rs_wpm').value);
            let words = parseInt(t);
            if(isNaN(words)) words = t.trim().split(/\s+/).filter(w=>w.length>0).length;
            const min = words / wpm;
            return { value: `${Math.ceil(min)} Min`, label: 'Estimated Time', isString: true };
        }
    },
    {
        id: 'study_plan', name: 'Study Planner', icon: '⏱️', category: 'productivity', desc: 'Divide topics by hours.',
        renderForm: () => `
            <div class="input-group"><label>Total Hours Available</label><input type="number" id="sp_hrs"></div>
            <div class="input-group"><label>Number of Topics</label><input type="number" id="sp_topics"></div>
        `,
        calculate: () => {
            const h = parseFloat(document.getElementById('sp_hrs').value);
            const t = parseFloat(document.getElementById('sp_topics').value);
            const per = (h / t) * 60;
            return { value: `${per.toFixed(0)} Min / Topic`, label: 'Time Allocation', isString: true };
        }
    },
    {
        id: 'pwd_gen', name: 'Password Gen', icon: '🔑', category: 'dev', desc: 'Strong random passwords.',
        renderForm: () => `
            <div class="input-group"><label>Length</label><input type="number" id="pg_len" value="16"></div>
            <div class="flex-row" style="gap:10px; margin-bottom:15px;">
                <label><input type="checkbox" id="pg_num" checked> Numbers</label>
                <label><input type="checkbox" id="pg_sym" checked> Symbols</label>
            </div>
        `,
        calculate: () => {
            const l = parseInt(document.getElementById('pg_len').value);
            const n = document.getElementById('pg_num').checked;
            const s = document.getElementById('pg_sym').checked;
            let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            if(n) chars += '0123456789';
            if(s) chars += '!@#$%^&*()_+~`|}{[]:;?>\x3C,./-=';
            let pwd = '';
            for(let i=0; l>i; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length));
            return { value: pwd, label: 'Generated Password', isString: true };
        }
    },
    {
        id: 'color_conv', name: 'Color Converter', icon: '🎨', category: 'dev', desc: 'HEX ↔ RGB ↔ HSL.',
        renderForm: () => `
            <div class="input-group"><label>Color (HEX, RGB, or HSL)</label><input type="text" id="cc_val" placeholder="#8b5cf6"></div>
            <div class="color-preview" id="cc_prev"></div>
        `,
        calculate: () => {
            const v = document.getElementById('cc_val').value.trim();
            document.getElementById('cc_prev').style.background = v;
            // Simple hex to rgb for demo
            if(v.startsWith('#')) {
                let r = parseInt(v.slice(1,3),16), g = parseInt(v.slice(3,5),16), b = parseInt(v.slice(5,7),16);
                return { value: `rgb(${r}, ${g}, ${b})`, label: 'RGB Value', isString: true };
            }
            return { value: v, label: 'Color', isString: true };
        }
    },
    {
        id: 'json_fmt', name: 'JSON Formatter', icon: '{}', category: 'dev', desc: 'Format & validate JSON.', isNew: true,
        renderForm: () => `
            <div class="input-group"><label>Raw JSON</label><textarea id="jf_val" rows="5" style="width:100%; background:var(--surface); border:1px solid var(--border); color:var(--text); padding:12px; border-radius:8px; font-family:monospace;"></textarea></div>
        `,
        calculate: () => {
            try {
                const obj = JSON.parse(document.getElementById('jf_val').value);
                return { value: JSON.stringify(obj, null, 2), label: 'Formatted JSON', isString: true };
            } catch(e) { throw new Error("Invalid JSON"); }
        }
    },
    {
        id: 'base64', name: 'Base64 Encode', icon: '🔤', category: 'dev', desc: 'Encode/Decode strings.',
        renderForm: () => `
            <div class="input-group"><label>Text</label><textarea id="b64_val" rows="3" style="width:100%; background:var(--surface); border:1px solid var(--border); color:var(--text); padding:12px; border-radius:8px;"></textarea></div>
            <div class="input-group"><label>Action</label><select id="b64_act"><option value="enc">Encode</option><option value="dec">Decode</option></select></div>
        `,
        calculate: () => {
            const v = document.getElementById('b64_val').value;
            const a = document.getElementById('b64_act').value;
            try {
                return { value: a==='enc' ? btoa(v) : atob(v), label: 'Result', isString: true };
            } catch(e) { throw new Error("Invalid string"); }
        }
    }
);

tools.push(
    {
        id: 'slug', name: 'Word to Slug', icon: '🔗', category: 'dev', desc: 'URL-friendly strings.',
        renderForm: () => `
            <div class="input-group"><label>Text</label><input type="text" id="sl_val"></div>
        `,
        calculate: () => {
            const v = document.getElementById('sl_val').value;
            const slug = v.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            return { value: slug, label: 'Slug', isString: true };
        }
    },
    {
        id: 'reverse', name: 'String Reverser', icon: '🔄', category: 'dev', desc: 'Reverse text or characters.',
        renderForm: () => `
            <div class="input-group"><label>Text</label><input type="text" id="rev_val"></div>
        `,
        calculate: () => {
            const v = document.getElementById('rev_val').value;
            return { value: v.split('').reverse().join(''), label: 'Reversed', isString: true };
        }
    },
    {
        id: 'emi', name: 'EMI Calculator', icon: '💳', category: 'finance', desc: 'Loan EMI calculation.',
        renderForm: () => `
            <div class="input-group"><label>Loan Amount</label><input type="number" id="emi_p"></div>
            <div class="input-group"><label>Interest Rate (Yearly %)</label><input type="number" id="emi_r"></div>
            <div class="input-group"><label>Tenure (Months)</label><input type="number" id="emi_n"></div>
        `,
        calculate: () => {
            const p = parseFloat(document.getElementById('emi_p').value);
            const r = parseFloat(document.getElementById('emi_r').value) / 12 / 100;
            const n = parseFloat(document.getElementById('emi_n').value);
            const emi = p * r * (Math.pow(1+r, n) / (Math.pow(1+r, n) - 1));
            return { value: emi, label: 'Monthly EMI', isString: false };
        }
    },
    {
        id: 'gst', name: 'GST Calculator', icon: '🧾', category: 'finance', desc: 'Add or remove GST.',
        renderForm: () => `
            <div class="input-group"><label>Amount</label><input type="number" id="gst_amt"></div>
            <div class="input-group"><label>GST %</label><select id="gst_pct"><option value="5">5%</option><option value="12">12%</option><option value="18" selected>18%</option><option value="28">28%</option></select></div>
            <div class="input-group"><label>Action</label><select id="gst_act"><option value="add">Add GST</option><option value="rem">Remove GST</option></select></div>
        `,
        calculate: () => {
            const a = parseFloat(document.getElementById('gst_amt').value);
            const p = parseFloat(document.getElementById('gst_pct').value);
            const act = document.getElementById('gst_act').value;
            let res = 0;
            if(act === 'add') res = a + (a * p / 100);
            else res = a - (a * (p / (100 + p)));
            return { value: res, label: 'Final Amount', isString: false };
        }
    },
    {
        id: 'tip', name: 'Tip Calculator', icon: '💁', category: 'finance', desc: 'Split bills & tips.',
        renderForm: () => `
            <div class="input-group"><label>Bill Amount</label><input type="number" id="tip_amt"></div>
            <div class="input-group"><label>Tip %</label><input type="number" id="tip_pct" value="10"></div>
            <div class="input-group"><label>Split Between (Persons)</label><input type="number" id="tip_split" value="1"></div>
        `,
        calculate: () => {
            const a = parseFloat(document.getElementById('tip_amt').value);
            const p = parseFloat(document.getElementById('tip_pct').value);
            const s = parseFloat(document.getElementById('tip_split').value);
            const total = a + (a * p / 100);
            return { value: total / s, label: 'Per Person', isString: false };
        }
    },
    {
        id: 'sip', name: 'SIP Calculator', icon: '📈', category: 'finance', desc: 'Mutual fund returns.', isNew: true,
        renderForm: () => `
            <div class="input-group"><label>Monthly Investment</label><input type="number" id="sip_p"></div>
            <div class="input-group"><label>Expected Return (% p.a)</label><input type="number" id="sip_r" value="12"></div>
            <div class="input-group"><label>Time Period (Years)</label><input type="number" id="sip_t"></div>
        `,
        calculate: () => {
            const p = parseFloat(document.getElementById('sip_p').value);
            const r = parseFloat(document.getElementById('sip_r').value) / 12 / 100;
            const n = parseFloat(document.getElementById('sip_t').value) * 12;
            const m = p * ((Math.pow(1+r, n) - 1) / r) * (1+r);
            return { value: m, label: 'Expected Amount', isString: false };
        }
    },
    {
        id: 'bmi', name: 'BMI Calculator', icon: '⚖️', category: 'health', desc: 'Body Mass Index.',
        renderForm: () => `
            <div class="input-group"><label>Weight (kg)</label><input type="number" id="bmi_w"></div>
            <div class="input-group"><label>Height (cm)</label><input type="number" id="bmi_h"></div>
        `,
        calculate: () => {
            const w = parseFloat(document.getElementById('bmi_w').value);
            const h = parseFloat(document.getElementById('bmi_h').value) / 100;
            const bmi = w / (h * h);
            let cat = '';
            if(18.5 > bmi) cat = 'Underweight';
            else if(25 > bmi) cat = 'Normal';
            else if(30 > bmi) cat = 'Overweight';
            else cat = 'Obese';
            return { value: `${bmi.toFixed(1)} (${cat})`, label: 'Your BMI', isString: true };
        }
    },
    {
        id: 'tdee', name: 'Calorie Estimator', icon: '🔥', category: 'health', desc: 'Daily calorie needs.',
        renderForm: () => `
            <div class="input-group"><label>Weight (kg)</label><input type="number" id="td_w"></div>
            <div class="input-group"><label>Height (cm)</label><input type="number" id="td_h"></div>
            <div class="input-group"><label>Age</label><input type="number" id="td_a"></div>
            <div class="input-group"><label>Activity</label><select id="td_act"><option value="1.2">Sedentary</option><option value="1.55">Moderate</option><option value="1.9">Active</option></select></div>
        `,
        calculate: () => {
            const w = parseFloat(document.getElementById('td_w').value);
            const h = parseFloat(document.getElementById('td_h').value);
            const a = parseFloat(document.getElementById('td_a').value);
            const act = parseFloat(document.getElementById('td_act').value);
            const bmr = 10 * w + 6.25 * h - 5 * a + 5; // simplified male
            return { value: bmr * act, label: 'Calories/Day', isString: false };
        }
    },
    {
        id: 'sleep', name: 'Sleep Cycle', icon: '🌙', category: 'health', desc: 'When to wake up.', isNew: true,
        renderForm: () => `
            <div class="input-group"><label>I want to wake up at</label><input type="time" id="sl_time"></div>
        `,
        calculate: () => {
            const t = document.getElementById('sl_time').value;
            if(!t) throw new Error("Select time");
            const [h, m] = t.split(':');
            let d = new Date(); d.setHours(h); d.setMinutes(m);
            // 90 min cycles, 15 min fall asleep
            let res = [];
            for(let i=6; i>=3; i--) {
                let w = new Date(d.getTime() - (i*90 + 15)*60000);
                res.push(w.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
            }
            return { value: res.join(' OR '), label: 'Go to bed at', isString: true };
        }
    },
    {
        id: 'otp', name: 'OTP Generator', icon: '📱', category: 'health', desc: 'Random numeric OTP.',
        renderForm: () => `
            <div class="input-group"><label>Length</label><input type="number" id="otp_len" value="6"></div>
        `,
        calculate: () => {
            const l = parseInt(document.getElementById('otp_len').value);
            let otp = '';
            for(let i=0; l>i; i++) otp += Math.floor(Math.random() * 10);
            return { value: otp, label: 'Your OTP', isString: true };
        }
    }
);

renderGrid();
