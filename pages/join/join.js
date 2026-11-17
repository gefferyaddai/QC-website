/* ── join page behavior ── init(root) / destroy(), called by pages/app.js.
   Headline blur-up (same as home) + staggered logo fade-in. Content is
   visible in the markup, so a script failure never hides anything. */

let timers = [];
let observers = [];

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function init(root) {
    if (reduced()) return;
    root.querySelectorAll('.hero-title .word').forEach((w, i) => {
        w.classList.add('pre-reveal');
        timers.push(setTimeout(() => w.classList.add('revealed'), 140 + i * 130));
    });

    const logos = [...root.querySelectorAll('.placed-logos li')];
    const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (!e.isIntersecting) return;
            const i = logos.indexOf(e.target);
            timers.push(setTimeout(() => e.target.classList.add('in'), (i % 4) * 90));
            io.unobserve(e.target);
        });
    }, { threshold: 0.2 });
    logos.forEach((li) => {
        li.classList.add('pre-in');
        if (li.getBoundingClientRect().bottom < 0) li.classList.add('in');
        else io.observe(li);
    });
    observers.push(io);
}

export function destroy() {
    timers.forEach(clearTimeout);
    timers = [];
    observers.forEach((o) => o.disconnect());
    observers = [];
}
