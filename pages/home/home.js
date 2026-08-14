/* ── home page behavior ──────────────────────────────────────────────────
   Same contract as before: init(root) / destroy(), called by pages/app.js.
   root is the routed container (#app-content). The hero chart graphic is
   static 2D SVG/CSS (see home.html/home.css) — no JS needed for it.
────────────────────────────────────────────────────────────────────────── */

let timers = [];
let observers = [];
let plx = [];
let onScroll = null;

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function init(root) {
    const step = (fn) => { try { fn(root); } catch (e) { console.warn('home init step failed', e); } };
    step(heroWords);
    step(reveal);
    step(roleCards);
    step(counters);
    step(parallax);
}

export function destroy() {
    timers.forEach((t) => { clearTimeout(t); clearInterval(t); });
    timers = [];
    observers.forEach((o) => o.disconnect());
    observers = [];
    if (onScroll) { window.removeEventListener('scroll', onScroll); onScroll = null; }
    plx = [];
}

/* headline blur-up — the words are already in the markup and visible, so a
   script failure can never hide the page title */
function heroWords(root) {
    if (reduced()) return;
    const words = [...root.querySelectorAll('.hero-title .word')];
    words.forEach((w, i) => {
        w.classList.add('pre-reveal');
        timers.push(setTimeout(() => w.classList.add('revealed'), 140 + i * 130));
    });
}

/* .fade-up → .visible. Also reveals anything already scrolled past, so a
   deep-linked or restored scroll position never leaves content invisible. */
function reveal(root) {
    const els = [...root.querySelectorAll('.fade-up')];
    const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (e.isIntersecting || e.boundingClientRect.bottom < 0) {
                e.target.classList.add('visible');
                io.unobserve(e.target);
            }
        });
    }, { threshold: 0.15 });
    els.forEach((el) => {
        if (el.getBoundingClientRect().bottom < 0) el.classList.add('visible');
        else io.observe(el);
    });
    observers.push(io);
}

function roleCards(root) {
    const cards = [...root.querySelectorAll('.role-card')];
    const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (!e.isIntersecting) return;
            const delay = parseInt(e.target.dataset.delay || '0', 10);
            timers.push(setTimeout(() => e.target.classList.add('slide-in'), delay));
            io.unobserve(e.target);
        });
    }, { threshold: 0.25 });
    cards.forEach((c) => {
        if (c.getBoundingClientRect().bottom < 0) c.classList.add('slide-in');
        else io.observe(c);
    });
    observers.push(io);
}

function counters(root) {
    const nums = [...root.querySelectorAll('.count-num')];
    if (!nums.length) return;
    const row = root.querySelector('.hero-stats');
    const settle = () => nums.forEach((el) => {
        el.textContent = el.dataset.target + (el.dataset.suffix || '');
    });

    if (!row || row.getBoundingClientRect().bottom < 0) { settle(); return; }

    const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (!e.isIntersecting && e.boundingClientRect.bottom >= 0) return;
            nums.forEach(countUp);
            io.disconnect();
        });
    }, { threshold: 0.6 });
    io.observe(row);
    observers.push(io);
}

function countUp(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const start = performance.now();
    const dur = 1400;
    const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
}

function parallax(root) {
    plx = [...root.querySelectorAll('[data-plx]')].map((el) => ({ el, k: parseFloat(el.dataset.plx) }));
    const apply = () => {
        if (reduced()) return;
        const vh = window.innerHeight;
        plx.forEach(({ el, k }) => {
            const r = el.getBoundingClientRect();
            const off = (r.top + r.height / 2 - vh / 2) * k * -0.28;
            el.style.transform = `translate3d(0,${off.toFixed(1)}px,0)`;
        });
    };
    onScroll = apply;
    window.addEventListener('scroll', onScroll, { passive: true });
    apply();
}
