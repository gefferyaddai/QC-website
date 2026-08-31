// Client-side router: swaps #app-content in place so the URL never changes.
// Each route's CSS is preloaded (disabled) in index.html's <head> and toggled
// on/off in lockstep with the content swap, so only one page's stylesheet is
// ever active — avoiding class-name collisions between page stylesheets that
// were each authored assuming they'd be the only one in the DOM.

const routes = {
    home: {
        html: '/pages/home/home.html',
        css: 'css-home',
        mod: '/pages/home/home.js',
        title: 'Quantitative Investment Society',
    },
    about: {
        html: '/pages/about/about.html',
        css: 'css-about',
        mod: '/pages/about/about.js',
        title: 'Quantitative Investment Society',
    },
    events: {
        html: '/pages/events/events.html',
        css: 'css-events',
        mod: '/pages/events/events.js',
        title: 'Quantitative Investment Society',
    },
    team: {
        html: '/pages/meet-the-team/mtt.html',
        css: 'css-team',
        mod: '/pages/meet-the-team/mtt.js',
        title: 'Quantitative Investment Society',
    },
    projects: {
        html: '/pages/projects/projects.html',
        css: 'css-projects',
        mod: '/pages/projects/projects.js',
        title: 'Quantitative Investment Society',
    },
    partner: {
        html: '/pages/partner/partner.html',
        css: 'css-partner',
        mod: '/pages/partner/partner.js',
        title: 'Quantitative Investment Society',
    },
    join: {
        html: '/pages/join/join.html',
        css: 'css-join',
        mod: '/pages/join/join.js',
        title: 'Quantitative Investment Society',
    },
};

const appEl = document.getElementById('app-content');
const fragmentCache = new Map();

let currentKey = null;
let currentModule = null;
let fadeObserver = null;

function initFadeUp(root) {
    const obs = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
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
    const res = await fetch(routes[key].html);
    const html = await res.text();
    fragmentCache.set(key, html);
    return html;
}

async function navigate(key, { scroll = true } = {}) {
    const route = routes[key];
    if (!route) return;

    const html = await fetchFragment(key);

    if (fadeObserver) {
        fadeObserver.disconnect();
        fadeObserver = null;
    }
    if (currentModule && typeof currentModule.destroy === 'function') {
        currentModule.destroy();
    }

    if (currentKey && routes[currentKey]) {
        document.getElementById(routes[currentKey].css).disabled = true;
    }
    document.getElementById(route.css).disabled = false;
    appEl.innerHTML = html;

    document.querySelectorAll('.nav-links a[data-route]').forEach((a) => {
        a.classList.toggle('active', a.dataset.route === key);
    });
    document.title = route.title;

    fadeObserver = initFadeUp(appEl);

    const mod = await import(route.mod);
    currentModule = mod;
    if (typeof mod.init === 'function') mod.init(appEl);

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
