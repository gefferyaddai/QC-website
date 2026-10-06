/* ── about / what-we-do behavior ─────────────────────────────────────────
   Same contract as before: init(root) / destroy(), called by pages/app.js.
   The global .fade-up reveal still comes from the router; this file adds the
   card stagger.
────────────────────────────────────────────────────────────────────────── */

let timers = [];
let observers = [];

export function init(root) {
    cardReveal(root);
}

export function destroy() {
    timers.forEach(clearTimeout);
    timers = [];
    observers.forEach((o) => o.disconnect());
    observers = [];
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
