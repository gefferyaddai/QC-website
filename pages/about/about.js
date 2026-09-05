/* ── about / what-we-do behavior ─────────────────────────────────────────
   Same contract as before: init(root) / destroy(), called by pages/app.js.
   The global .fade-up reveal still comes from the router; this file adds the
   card stagger, the cursor tilt, and parallax.
────────────────────────────────────────────────────────────────────────── */

let timers = [];
let observers = [];
let plx = [];
let onScroll = null;

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function init(root) {
    const step = (fn) => { try { fn(root); } catch (e) { console.warn('about init step failed', e); } };
    step(cardReveal);
    step(cardTilt);
    step(parallax);
}

export function destroy() {
    timers.forEach(clearTimeout);
    timers = [];
    observers.forEach((o) => o.disconnect());
    observers = [];
    if (onScroll) { window.removeEventListener('scroll', onScroll); onScroll = null; }
    plx = [];
}

/* staggered card reveal; anything already scrolled past shows immediately */
function cardReveal(root) {
    const cards = [...root.querySelectorAll('.card')];
    const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (!e.isIntersecting) return;
            const delay = parseInt(e.target.dataset.delay || '0', 10);
            timers.push(setTimeout(() => e.target.classList.add('visible'), delay));
            io.unobserve(e.target);
        });
    }, { threshold: 0.2 });
    cards.forEach((c) => {
        if (c.getBoundingClientRect().bottom < 0) c.classList.add('visible');
        else io.observe(c);
    });
    observers.push(io);
}

/* cursor-tracked tilt with a specular highlight that follows the pointer */
function cardTilt(root) {
    if (reduced() || window.matchMedia('(hover: none)').matches) return;

    [...root.querySelectorAll('[data-tilt]')].forEach((card) => {
        const spec = card.querySelector('.card-spec');
        const orb = card.querySelector('.card-orb');
        const ready = () => card.classList.contains('visible');
        let entered = false;

        const applyEnter = () => {
            card.style.transition = 'transform .18s ease-out, box-shadow .35s ease';
            card.style.boxShadow = '0 26px 60px rgba(120,110,130,.20), 0 0 0 1px rgba(163,171,182,.4)';
            if (spec) spec.style.opacity = '1';
            if (orb) orb.style.opacity = '.75';
            entered = true;
        };

        card.addEventListener('pointerenter', () => {
            if (!ready()) return;
            applyEnter();
        });

        card.addEventListener('pointermove', (e) => {
            if (!ready()) return;
            if (!entered) applyEnter();
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width;
            const py = (e.clientY - r.top) / r.height;
            card.style.transform = `translateY(-6px) rotateX(${((0.5 - py) * 7).toFixed(2)}deg) rotateY(${((px - 0.5) * 9).toFixed(2)}deg)`;
            if (spec) {
                spec.style.background = `radial-gradient(320px circle at ${(px * 100).toFixed(1)}% ${(py * 100).toFixed(1)}%,rgba(255,255,255,.95),rgba(233,235,239,.35) 45%,transparent 72%)`;
            }
        });

        card.addEventListener('pointerleave', () => {
            if (!ready()) return;
            card.style.transition = 'transform .5s cubic-bezier(0.22,1,0.36,1), box-shadow .35s ease';
            card.style.transform = '';
            card.style.boxShadow = '';
            if (spec) spec.style.opacity = '0';
            if (orb) orb.style.opacity = '';
            entered = false;
        });
    });
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

