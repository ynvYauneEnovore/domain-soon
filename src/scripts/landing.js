/* ===== CONFIGURACIÓN: cambia solo esto para cada dominio ===== */
const C = {
  name: "OpenRed Bolivia", // vacío ("") = usa el nombre del dominio automáticamente
  initials: "OR", // vacío = se generan solas
  status: "Sitio en desarrollo",
  sub: "Nuestro nuevo sitio web está en camino.",
  whatsapp: "59176115022", // vacío = oculta el botón
  email: "", // vacío = oculta el botón
  access: { label: "Acceder al sistema", url: "" }, // url vacía = oculta el botón (ej. "https://app.midominio.com")
  address: "Santa Cruz, Bolivia",
  marquee: "Próximamente",
  colors: ["#2f6bff", "#22d3ee", "#8b5cf6"]
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

/* botones magnéticos */
document.querySelectorAll(".btn").forEach(b => {
  b.addEventListener("pointermove", e => {
    const r = b.getBoundingClientRect();
    b.style.translate = ((e.clientX - r.left - r.width / 2) * .22) + "px " + ((e.clientY - r.top - r.height / 2) * .35) + "px";
  });
  b.addEventListener("pointerleave", () => b.style.translate = "");
});

/* campo de flujo: hilos de luz que giran alrededor del cursor */
const cv = $("fx");
const cu = $("cur");
let m = { x: -999, y: -999, cx: -999, cy: -999 };
let W, H, P = [], t = 0;
let x = null;

if(cv) x = cv.getContext("2d");

const sp = () => ({ x: Math.random() * W, y: Math.random() * H, c: C.colors[Math.random() * 3 | 0], l: Math.random() * 220 + 80 });

function rs() {
  if(!cv) return;
  const D = Math.min(devicePixelRatio || 1, 2);
  W = innerWidth;
  H = innerHeight;
  cv.width = W * D;
  cv.height = H * D;
  x.setTransform(D, 0, 0, D, 0, 0);
  P = Array.from({ length: Math.min(300, W * H / 5500 | 0) }, sp);
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

  function draw() {
    t += .004;
    
    // Clear canvas
    x.globalCompositeOperation = "destination-out";
    
    // Use the CSS variable alpha
    const alphaVal = getComputedStyle(document.documentElement).getPropertyValue('--canvas-alpha').trim() || '0.08';
    x.fillStyle = `rgba(0,0,0,${alphaVal})`; 
    x.fillRect(0, 0, W, H);
    
    x.globalCompositeOperation = "source-over";
    x.lineWidth = 1.2;
    x.globalAlpha = 0.65;
    
    for (const p of P) {
      const s = .0016;
      const a = (Math.sin(p.x * s * 2 + t * 3) + Math.cos(p.y * s * 2.6 - t * 2) + Math.sin((p.x + p.y) * s)) * Math.PI * .9;
      let vx = Math.cos(a), vy = Math.sin(a);
      const dx = m.x - p.x, dy = m.y - p.y, d = Math.hypot(dx, dy) || 1;
      
      if (d < 240) {
        const f = (1 - d / 240) * 2.6;
        vx += -dy / d * f;
        vy += dx / d * f;
      }
      
      const nx = p.x + vx * 1.4, ny = p.y + vy * 1.4;
      x.strokeStyle = p.c;
      x.beginPath();
      x.moveTo(p.x, p.y);
      x.lineTo(nx, ny);
      x.stroke();
      
      p.x = nx;
      p.y = ny;
      if (--p.l < 0 || nx < 0 || nx > W || ny < 0 || ny > H) Object.assign(p, sp());
    }
    
    m.cx += (m.x - m.cx) * .12;
    m.cy += (m.y - m.cy) * .12;
    if(cu) cu.style.transform = "translate(" + m.cx + "px," + m.cy + "px)";
    
    requestAnimationFrame(draw);
  }

  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    draw();
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
