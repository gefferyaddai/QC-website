/* ── home page behavior ──────────────────────────────────────────────────
   Same contract as before: init(root) / destroy(), called by pages/app.js.
   root is the routed container (#app-content). The hero chart graphic is
   static 2D SVG/CSS (see home.html/home.css) — no JS needed for it.
────────────────────────────────────────────────────────────────────────── */

let timers = [];
let observers = [];

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function init(root) {
    const step = (fn) => { try { fn(root); } catch (e) { console.warn('home init step failed', e); } };
    step(heroWords);
    step(roleCards);
}

export function destroy() {
    timers.forEach(clearTimeout);
    timers = [];
    observers.forEach((o) => o.disconnect());
    observers = [];
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
