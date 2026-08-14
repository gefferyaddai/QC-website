// Shell-level nav behavior — bound once, since the nav/footer are never
// re-injected (only #app-content is swapped between routes).
(function () {
    // iOS Safari only fires :active on tap when some touch listener exists
    // on an ancestor — without this, every :active press state below is inert.
    document.addEventListener('touchstart', function () {}, { passive: true });

    const nav = document.getElementById('mainNav');
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    });

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('open');
        links.classList.toggle('open');
    });

    links.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', () => {
            toggle.classList.remove('open');
            links.classList.remove('open');
        });
    });
})();
