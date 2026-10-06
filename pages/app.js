// Client-side router: swaps #app-content in place so the URL never changes.
// Each route's CSS is preloaded (disabled) in index.html's <head> and toggled
// on/off in lockstep with the content swap, so only one page's stylesheet is
// ever active — avoiding class-name collisions between page stylesheets that
// were each authored assuming they'd be the only one in the DOM.

// key → page folder/file stem; only routes listed in `withJs` load a module
const routes = {
    home: 'home/home',
    about: 'about/about',
    events: 'events/events',
    team: 'meet-the-team/mtt',
    projects: 'projects/projects',
    partner: 'partner/partner',
    join: 'join/join',
};
const withJs = new Set(['home', 'about', 'events']);

const appEl = document.getElementById('app-content');
const fragmentCache = new Map();

let currentKey = null;
let currentModule = null;
let fadeObserver = null;

function initFadeUp(root) {
    const obs = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                // also reveal anything already scrolled past, so a restored
                // scroll position never leaves content invisible
                if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1 }
    );
    root.querySelectorAll('.fade-up').forEach((el) => obs.observe(el));
    return obs;
}

async function fetchFragment(key) {
    if (fragmentCache.has(key)) return fragmentCache.get(key);
    // revalidate so an edited fragment is never served stale from the HTTP cache
    const res = await fetch(`/pages/${routes[key]}.html`, { cache: 'no-cache' });
    const html = await res.text();
    fragmentCache.set(key, html);
    return html;
}

async function navigate(key, { scroll = true } = {}) {
    if (!routes[key]) return;

    const html = await fetchFragment(key);

    if (fadeObserver) {
        fadeObserver.disconnect();
        fadeObserver = null;
    }
    if (currentModule) currentModule.destroy();

    if (currentKey) document.getElementById(`css-${currentKey}`).disabled = true;
    document.getElementById(`css-${key}`).disabled = false;
    appEl.innerHTML = html;

    document.querySelectorAll('.nav-links a[data-route]').forEach((a) => {
        a.classList.toggle('active', a.dataset.route === key);
    });

    fadeObserver = initFadeUp(appEl);

    // reuse app.js's own ?v= tag so page modules are cache-busted with it
    currentModule = withJs.has(key) ? await import(`/pages/${routes[key]}.js${new URL(import.meta.url).search}`) : null;
    if (currentModule) currentModule.init(appEl);

    currentKey = key;

    if (scroll) {
        if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true });
        else window.scrollTo(0, 0);
        appEl.focus({ preventScroll: true });
    }
}

document.addEventListener('click', (e) => {
    const routeEl = e.target.closest('[data-route]');
    if (routeEl) {
        e.preventDefault();
        const key = routeEl.dataset.route;
        if (key !== currentKey) navigate(key);
        return;
    }

    const scrollEl = e.target.closest('[data-scroll]');
    if (scrollEl) {
        e.preventDefault();
        const target = document.getElementById(scrollEl.dataset.scroll);
        if (!target) return;
        if (window.__lenis) window.__lenis.scrollTo(target);
        else target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

navigate('home', { scroll: false });

function idlePrefetch() {
    Object.keys(routes).forEach((key) => {
        if (key !== 'home') fetchFragment(key);
    });
}
if ('requestIdleCallback' in window) {
    requestIdleCallback(idlePrefetch, { timeout: 3000 });
} else {
    setTimeout(idlePrefetch, 1500);
}
