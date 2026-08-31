/* Inertial smooth scrolling (Lenis, MIT). Shell-level: applies to every route.
   Drives real window scroll, so IntersectionObservers and scrollY listeners
   elsewhere in the app keep working untouched. */
(function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof Lenis === 'undefined') return;

    const lenis = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
    });

    const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    window.__lenis = lenis;
})();
