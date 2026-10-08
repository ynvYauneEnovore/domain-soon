/* ===== CONFIGURACIÓN: cambia solo esto para cada dominio ===== */
const C = {
  name: "OpenRed Bolivia", 
  initials: "OR", 
  status: "Sitio en desarrollo",
  sub: "Nuestro nuevo sitio web está en camino.",
  whatsapp: "59176115022", 
  email: "", 
  access: { label: "Acceder al sistema", url: "" }, 
  address: "Santa Cruz, Bolivia",
  marquee: "Próximamente",
  colors: ["#10b981", "#34d399", "#059669"] // Hacker Green colors
};
/* ============================================================ */

const $ = id => document.getElementById(id);
const R = document.documentElement.style;
const host = location.hostname.replace(/^www\./, "");
const name = C.name || (host.split(".")[0] || "Próximamente").replace(/^./, m => m.toUpperCase());

C.colors.forEach((c, i) => R.setProperty("--" + "abc"[i], c));
document.title = name;

const iniEl = $("ini");
if(iniEl) iniEl.textContent = C.initials || name.split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();

const stEl = $("st"); if(stEl) stEl.textContent = C.status;
const subEl = $("sub"); if(subEl) subEl.textContent = C.sub;
const adrEl = $("adr"); if(adrEl) adrEl.textContent = C.address;
const cpEl = $("cp"); if(cpEl) cpEl.textContent = "© " + new Date().getFullYear() + " " + name;

const waEl = $("wa");
if(waEl) {
  waEl.hidden = !C.whatsapp;
  waEl.href = "https://wa.me/" + C.whatsapp;
}

const emEl = $("em");
if(emEl) {
  emEl.hidden = !C.email;
  emEl.href = "mailto:" + C.email;
}

const acEl = $("ac");
if(acEl) {
  acEl.hidden = !C.access.url;
  acEl.href = C.access.url;
  acEl.textContent = C.access.label;
}

const mqEl = $("mq");
if(mqEl) mqEl.innerHTML = Array(8).fill("<span>" + C.marquee + "</span>").join("");

/* título letra por letra */
const h = $("ttl");
let Ls = [];
let rc = [];
let k = 0;

if(h) {
  h.textContent = "";
  h.setAttribute("aria-label", name);
  
  name.split(" ").forEach((wd, wi, a) => {
    const w = document.createElement("span");
    w.className = "w";
    w.setAttribute("aria-hidden", "true");
    [...wd].forEach(ch => {
      const l = document.createElement("span");
      l.className = "l";
      l.textContent = ch;
      l.style.setProperty("--i", k++);
      w.append(l);
    });
    h.append(w);
    if (wi < a.length - 1) h.append(" ");
  });

  Ls = [...h.querySelectorAll(".l")];
}

const meas = () => {
  rc = Ls.map(l => {
    const r = l.getBoundingClientRect();
    return [r.left + r.width / 2, r.top + r.height / 2];
  });
};
setTimeout(meas, 2200);

const wave = () => Ls.forEach((l, i) => {
  setTimeout(() => l.style.setProperty("--k", .9), i * 55);
  setTimeout(() => l.style.setProperty("--k", 0), i * 55 + 380);
});

if(Ls.length) {
  setTimeout(() => { wave(); setInterval(wave, 7000) }, 2300);
}

/* campo de flujo: Matrix Hacker Rain */
const cv = $("fx");
const cu = $("cur");
let m = { x: -999, y: -999, cx: -999, cy: -999 };
let W, H;
let x = null;

// Matrix settings
let fontSize = 16;
let columns = [];
let charStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";

if(cv) x = cv.getContext("2d");

function rs() {
  if(!cv) return;
  const D = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth;
  H = innerHeight;
  cv.width = W * D;
  cv.height = H * D;
  x.setTransform(D, 0, 0, D, 0, 0);
  
  const cols = Math.floor(W / fontSize) + 1;
  columns = Array(cols).fill(0).map(() => Math.random() * -100);
  setTimeout(meas, 300);
}

if(cv) {
  addEventListener("resize", rs);
  rs();

  addEventListener("pointermove", e => {
    m.x = e.clientX;
    m.y = e.clientY;
    Ls.forEach((l, i) => {
      if (rc[i]) l.style.setProperty("--k", Math.max(0, 1 - Math.hypot(m.x - rc[i][0], m.y - rc[i][1]) / 170).toFixed(2));
    });
  });

  addEventListener("pointerleave", () => { m.x = m.y = -999; });

  function drawMatrix() {
    const alphaVal = getComputedStyle(document.documentElement).getPropertyValue('--canvas-alpha').trim() || '0.15';
    
    // Trail effect
    x.fillStyle = `rgba(0,0,0,${alphaVal})`;
    x.globalCompositeOperation = "source-over";
    x.fillRect(0, 0, W, H);
    
    x.font = `600 ${fontSize}px var(--font-geist, monospace)`;
    
    for (let i = 0; i < columns.length; i++) {
      const text = charStr.charAt(Math.floor(Math.random() * charStr.length));
      const charX = i * fontSize;
      const charY = columns[i] * fontSize;
      
      const dx = m.x - charX;
      const dy = m.y - charY;
      const dist = Math.hypot(dx, dy);
      
      let opacity = 0.3;
      if (dist < 150) {
        opacity = 1 - (dist / 150);
        x.fillStyle = `rgba(52, 211, 153, ${opacity + 0.2})`; // bright green near cursor
        x.shadowBlur = 8;
        x.shadowColor = "#34d399";
      } else {
        x.fillStyle = `rgba(5, 150, 105, 0.4)`; // subtle green normal
        x.shadowBlur = 0;
      }
      
      x.fillText(text, charX, charY);
      
      if (charY > H && Math.random() > 0.98) {
        columns[i] = 0;
      }
      columns[i] += 0.8; // fall speed
    }
    
    // Cursor glow follow
    m.cx += (m.x - m.cx) * .12;
    m.cy += (m.y - m.cy) * .12;
    if(cu) cu.style.transform = "translate(" + m.cx + "px," + m.cy + "px)";
    
    requestAnimationFrame(drawMatrix);
  }

  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    drawMatrix();
  }
}

/* Tema Toggle (Dark / Light) */
const themeBtn = $('theme-btn');
const themeIcon = $('theme-icon');
const htmlEl = document.documentElement;

const sunIcon = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
const moonIcon = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';

if (themeBtn) {
  let isDark = localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && matchMedia('(prefers-color-scheme: dark)').matches);

  function updateTheme() {
    htmlEl.setAttribute('data-theme', isDark ? 'dark' : 'light');
    themeIcon.innerHTML = isDark ? sunIcon : moonIcon;
  }
  
  updateTheme();

  themeBtn.addEventListener('click', () => {
    isDark = !isDark;
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateTheme();
  });
}
