/* ── home page behavior ──────────────────────────────────────────────────
   Same contract as before: init(root) / destroy(), called by pages/app.js.
   root is the routed container (#app-content).
────────────────────────────────────────────────────────────────────────── */

let timers = [];
let observers = [];
let plx = [];
let onScroll = null;
let activeCleanup = null;

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function init(root) {
    const step = (fn) => { try { fn(root); } catch (e) { console.warn('home init step failed', e); } };
    step(heroWords);
    step(reveal);
    step(roleCards);
    step(counters);
    step(parallax);
    step(chart3d);
}

export function destroy() {
    timers.forEach((t) => { clearTimeout(t); clearInterval(t); });
    timers = [];
    observers.forEach((o) => o.disconnect());
    observers = [];
    if (onScroll) { window.removeEventListener('scroll', onScroll); onScroll = null; }
    if (activeCleanup) { activeCleanup(); activeCleanup = null; }
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
    const caret = root.querySelector('#heroCaret');
    if (caret) timers.push(setTimeout(() => caret.classList.add('done'), 3600));
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

/* ── 3D candlestick chart ──────────────────────────────────────────────
   three.js is loaded on demand from the CDN as an ES module. To vendor it
   instead, drop three.module.js beside this file and change the two
   import() specifiers to relative paths. If the import fails the hero
   simply renders without the graphic. */
async function chart3d(root) {
    const stage = root.querySelector('#chartStage');
    if (!stage || reduced()) return;

    // Local to this call — never shared with any other in-flight or past
    // instance, so a stale async continuation (e.g. the user navigated away
    // and back before this finished setting up) can't clobber a newer
    // instance's renderer/raf, and can't be clobbered by one either.
    let alive = true;
    let raf = null;
    let renderer = null;
    let onPointerMove = null;
    let onResize = null;
    const cleanup = () => {
        alive = false;
        if (raf) cancelAnimationFrame(raf);
        if (onPointerMove) window.removeEventListener('pointermove', onPointerMove);
        if (onResize) window.removeEventListener('resize', onResize);
        if (renderer) { renderer.dispose(); renderer.domElement.remove(); }
    };
    activeCleanup = cleanup;

    let THREE;
    try {
        THREE = await import('https://esm.sh/three@0.164.1');
    } catch (err) {
        console.warn('three.js unavailable — hero graphic skipped', err);
        return;
    }
    if (!alive) return; // destroy() ran while three.js was loading

    const w = () => stage.clientWidth;
    const h = () => stage.clientHeight;

    try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w(), h());
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    stage.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // bright silver/cream studio environment so the metal reads as polished
    // silver rather than black
    const env = document.createElement('canvas');
    env.width = 512; env.height = 256;
    const ctx = env.getContext('2d');
    const sky = ctx.createLinearGradient(0, 0, 0, 256);
    sky.addColorStop(0, '#ffffff');
    sky.addColorStop(0.38, '#eef0f3');
    sky.addColorStop(0.52, '#f7eef5');
    sky.addColorStop(0.72, '#c3c9d1');
    sky.addColorStop(1, '#8f97a3');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, 512, 256);
    const hot = ctx.createRadialGradient(120, 70, 6, 120, 70, 130);
    hot.addColorStop(0, 'rgba(255,255,255,1)');
    hot.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = hot; ctx.fillRect(0, 0, 300, 200);
    const rim = ctx.createRadialGradient(400, 150, 6, 400, 150, 120);
    rim.addColorStop(0, 'rgba(224,122,184,.85)');
    rim.addColorStop(1, 'rgba(224,122,184,0)');
    ctx.fillStyle = rim; ctx.fillRect(240, 40, 272, 216);

    const envTex = new THREE.CanvasTexture(env);
    envTex.mapping = THREE.EquirectangularReflectionMapping;
    envTex.colorSpace = THREE.SRGBColorSpace;
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromEquirectangular(envTex).texture;
    envTex.dispose();

    const camera = new THREE.PerspectiveCamera(32, w() / h(), 0.1, 100);
    camera.position.set(0, 0.5, 4.3);
    camera.lookAt(0, 0, 0);

    const group = new THREE.Group();
    group.rotation.set(0.13, -0.34, 0);
    scene.add(group);

    const N = 34, SPAN = 4.6, STEP = SPAN / (N - 1), INTERVAL = 780;

    const silver = new THREE.MeshPhysicalMaterial({ color: 0xe8ebef, metalness: 0.78, roughness: 0.26, clearcoat: 0.7, clearcoatRoughness: 0.2, envMapIntensity: 1.4 });
    const rose = new THREE.MeshPhysicalMaterial({ color: 0xc0509a, metalness: 0.55, roughness: 0.32, clearcoat: 0.6, envMapIntensity: 1.2 });
    const wickMat = new THREE.MeshStandardMaterial({ color: 0xb6bcc6, metalness: 0.7, roughness: 0.35 });
    const lineMat = new THREE.MeshPhysicalMaterial({ color: 0xf1f3f6, metalness: 0.95, roughness: 0.12, clearcoat: 1, envMapIntensity: 1.6 });

    let price = 0;
    const bars = [];
    const makeBar = () => {
        const o = price;
        price += (Math.random() - 0.48) * 0.3 + Math.sin(bars.length * 0.35) * 0.02;
        price = Math.max(-1.05, Math.min(1.05, price));
        const c = price;
        return {
            o, c,
            hi: Math.max(o, c) + Math.random() * 0.09,
            lo: Math.min(o, c) - Math.random() * 0.09,
        };
    };
    for (let i = 0; i < N; i++) bars.push(makeBar());

    const chart = new THREE.Group();
    group.add(chart);

    const bodyGeo = new THREE.BoxGeometry(0.1, 1, 0.1);
    const wickGeo = new THREE.CylinderGeometry(0.011, 0.011, 1, 8);
    const nodes = [];
    for (let i = 0; i < N; i++) {
        const g = new THREE.Group();
        const body = new THREE.Mesh(bodyGeo, silver);
        const wick = new THREE.Mesh(wickGeo, wickMat);
        g.add(wick); g.add(body);
        g.position.x = -SPAN / 2 + i * STEP;
        chart.add(g);
        nodes.push({ g, body, wick });
    }

    let tube = null;
    const rebuildTube = () => {
        const pts = bars.map((b, i) => new THREE.Vector3(-SPAN / 2 + i * STEP, b.c, 0.14));
        const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.35);
        const geo = new THREE.TubeGeometry(curve, 170, 0.034, 12, false);
        if (tube) { chart.remove(tube); tube.geometry.dispose(); }
        tube = new THREE.Mesh(geo, lineMat);
        chart.add(tube);
    };

    const applyBars = () => {
        nodes.forEach((n, i) => {
            const b = bars[i];
            n.body.scale.y = Math.max(Math.abs(b.c - b.o), 0.035);
            n.body.position.y = (b.o + b.c) / 2;
            n.body.material = b.c >= b.o ? silver : rose;
            n.wick.scale.y = Math.max(b.hi - b.lo, 0.05);
            n.wick.position.y = (b.hi + b.lo) / 2;
            const fade = Math.min(1, i / 4) * Math.min(1, (N - 1 - i) / 2 + 0.35);
            n.g.scale.x = n.g.scale.z = 0.55 + fade * 0.45;
        });
    };
    applyBars();
    rebuildTube();

    // faint silver price grid behind the chart
    const gridPts = [];
    for (let k = -2; k <= 2; k++) {
        gridPts.push(-SPAN / 2 - 0.2, k * 0.45, -0.5, SPAN / 2 + 0.2, k * 0.45, -0.5);
    }
    const gridGeo = new THREE.BufferGeometry();
    gridGeo.setAttribute('position', new THREE.Float32BufferAttribute(gridPts, 3));
    group.add(new THREE.LineSegments(gridGeo, new THREE.LineBasicMaterial({ color: 0xa3abb6, transparent: true, opacity: 0.22 })));

    scene.add(new THREE.HemisphereLight(0xffffff, 0xd7dae0, 1.6));
    const key = new THREE.DirectionalLight(0xffffff, 2.6); key.position.set(2, 4, 4); scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 1.1); fill.position.set(-3, 2, 3); scene.add(fill);
    const pink = new THREE.PointLight(0xc0509a, 22, 14); pink.position.set(-2.6, 1.6, 1.8); scene.add(pink);
    const lav = new THREE.PointLight(0x9b93ea, 16, 14); lav.position.set(2.4, 1.2, -2.2); scene.add(lav);

    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    onPointerMove = (e) => {
        const r = stage.getBoundingClientRect();
        target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
        target.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    onResize = () => {
        renderer.setSize(w(), h());
        camera.aspect = w() / h();
        camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let lastShift = performance.now();
    timers.push(setTimeout(() => { if (alive) stage.classList.add('ready'); }, 260));

    const animate = () => {
        if (!alive) return;
        raf = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        const now = performance.now();

        let p = (now - lastShift) / INTERVAL;
        if (p >= 1) {
            bars.shift(); bars.push(makeBar());
            applyBars(); rebuildTube();
            lastShift = now; p = 0;
        }
        chart.position.x = -p * STEP;

        pointer.x += (target.x - pointer.x) * 0.05;
        pointer.y += (target.y - pointer.y) * 0.05;
        group.rotation.y = -0.34 + pointer.x * 0.16 + Math.sin(t * 0.22) * 0.03;
        group.rotation.x = 0.13 + pointer.y * 0.06;
        group.position.y = Math.sin(t * 0.5) * 0.035;

        renderer.render(scene, camera);
    };
    animate();
    } catch (err) {
        console.warn('chart3d setup failed — hero graphic skipped', err);
        cleanup();
    }
}
