/* ── about / what-we-do behavior ─────────────────────────────────────────
   Same contract as before: init(root) / destroy(), called by pages/app.js.
   The global .fade-up reveal still comes from the router; this file adds the
   card stagger, the cursor tilt, parallax, and the 3D rings.
────────────────────────────────────────────────────────────────────────── */

let timers = [];
let observers = [];
let raf = null;
let plx = [];
let onScroll = null;
let onPointerMove = null;
let onResize = null;
let onRespResize = null;
let renderer = null;

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function init(root) {
    const step = (fn) => { try { fn(root); } catch (e) { console.warn('about init step failed', e); } };
    step(cardReveal);
    step(cardTilt);
    step(parallax);
    step(responsive);
    step(rings3d);
}

export function destroy() {
    timers.forEach(clearTimeout);
    timers = [];
    observers.forEach((o) => o.disconnect());
    observers = [];
    if (raf) { cancelAnimationFrame(raf); raf = null; }
    if (onScroll) { window.removeEventListener('scroll', onScroll); onScroll = null; }
    if (onPointerMove) { window.removeEventListener('pointermove', onPointerMove); onPointerMove = null; }
    if (onResize) { window.removeEventListener('resize', onResize); onResize = null; }
    if (onRespResize) { window.removeEventListener('resize', onRespResize); onRespResize = null; }
    if (renderer) { renderer.dispose(); renderer.domElement.remove(); renderer = null; }
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

/* cursor-tracked 3D tilt with a specular highlight that follows the pointer */
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

/* The CSS media queries already handle every breakpoint. This only keeps the
   grids correct when the router swaps content in at a size the stylesheet was
   not evaluated against — harmless to delete if you prefer pure CSS. */
function responsive(root) {
    const bottom = root.querySelector('.bottom-row');
    if (!bottom) return;
    const apply = () => {
        const narrow = window.innerWidth <= 768;
        bottom.style.flexDirection = narrow ? 'column' : '';
        bottom.style.alignItems = narrow ? 'flex-start' : '';
    };
    onRespResize = apply;
    window.addEventListener('resize', apply);
    apply();
}

/* ── three orbiting silver rings, one per pillar ────────────────────────
   three.js loads on demand from the CDN. To vendor it, drop three.module.js
   beside this file and change the import() specifier to a relative path. If
   the import fails the header simply renders without the graphic. */
async function rings3d(root) {
    const stage = root.querySelector('#ringsStage');
    if (!stage || reduced()) return;

    let THREE;
    try {
        THREE = await import('https://esm.sh/three@0.164.1');
    } catch (err) {
        console.warn('three.js unavailable — rings skipped', err);
        return;
    }

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
    sky.addColorStop(0.54, '#f7eef5');
    sky.addColorStop(0.74, '#c3c9d1');
    sky.addColorStop(1, '#8f97a3');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, 512, 256);
    const hot = ctx.createRadialGradient(120, 66, 6, 120, 66, 130);
    hot.addColorStop(0, 'rgba(255,255,255,1)');
    hot.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = hot; ctx.fillRect(0, 0, 300, 200);
    const rim = ctx.createRadialGradient(400, 150, 6, 400, 150, 120);
    rim.addColorStop(0, 'rgba(224,122,184,.85)');
    rim.addColorStop(1, 'rgba(224,122,184,0)');
    ctx.fillStyle = rim; ctx.fillRect(240, 40, 272, 216);

    const tex = new THREE.CanvasTexture(env);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    scene.environment = new THREE.PMREMGenerator(renderer).fromEquirectangular(tex).texture;
    tex.dispose();

    const camera = new THREE.PerspectiveCamera(34, w() / h(), 0.1, 100);
    camera.position.set(0, 0.2, 5.6);
    camera.lookAt(0, 0, 0);

    const group = new THREE.Group();
    scene.add(group);

    const chrome = new THREE.MeshPhysicalMaterial({ color: 0xe9ecf0, metalness: 0.92, roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.14, envMapIntensity: 1.5 });
    const roseMat = new THREE.MeshPhysicalMaterial({ color: 0xc0509a, metalness: 0.6, roughness: 0.28, clearcoat: 0.7, envMapIntensity: 1.2 });
    const lavMat = new THREE.MeshPhysicalMaterial({ color: 0x8d84e0, metalness: 0.6, roughness: 0.28, clearcoat: 0.7, envMapIntensity: 1.2 });

    const rings = [
        { r: 1.62, t: 0.050, mat: chrome, ax: [1.15, 0.20, 0.0], sp: 0.30 },
        { r: 1.28, t: 0.042, mat: roseMat, ax: [0.35, 0.95, 0.2], sp: -0.40 },
        { r: 0.96, t: 0.036, mat: lavMat, ax: [0.10, 0.30, 1.1], sp: 0.52 },
    ].map((cfg) => {
        const m = new THREE.Mesh(new THREE.TorusGeometry(cfg.r, cfg.t, 24, 180), cfg.mat);
        m.rotation.set(cfg.ax[0], cfg.ax[1], cfg.ax[2]);
        group.add(m);
        return { m, sp: cfg.sp, base: [...cfg.ax] };
    });

    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 0), chrome);
    group.add(core);

    scene.add(new THREE.HemisphereLight(0xffffff, 0xd7dae0, 1.5));
    const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(2, 4, 4); scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, 1.0); fill.position.set(-3, 2, 3); scene.add(fill);
    const pink = new THREE.PointLight(0xc0509a, 18, 14); pink.position.set(-2.4, 1.4, 2.0); scene.add(pink);
    const lav = new THREE.PointLight(0x9b93ea, 14, 14); lav.position.set(2.4, -1.0, -2.0); scene.add(lav);

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
    timers.push(setTimeout(() => stage.classList.add('ready'), 260));

    const animate = () => {
        raf = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();

        rings.forEach(({ m, sp, base }) => {
            m.rotation.set(base[0] + t * sp * 0.5, base[1] + t * sp, base[2] + t * sp * 0.3);
        });
        core.rotation.set(t * 0.24, t * 0.32, 0);

        pointer.x += (target.x - pointer.x) * 0.05;
        pointer.y += (target.y - pointer.y) * 0.05;
        group.rotation.y = pointer.x * 0.26;
        group.rotation.x = pointer.y * 0.14;
        group.position.y = Math.sin(t * 0.5) * 0.04;

        renderer.render(scene, camera);
    };
    animate();
    } catch (err) {
        console.warn('rings3d setup failed — rings skipped', err);
        if (onPointerMove) { window.removeEventListener('pointermove', onPointerMove); onPointerMove = null; }
        if (onResize) { window.removeEventListener('resize', onResize); onResize = null; }
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        if (renderer) { renderer.dispose(); renderer.domElement.remove(); renderer = null; }
    }
}
