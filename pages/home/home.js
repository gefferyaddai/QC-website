// ── Nav scroll shadow
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40));

// ── Typing animation — title first, then subtitle
const titleEl  = document.getElementById('heroTitle');
const subEl    = document.getElementById('typedSub');
const titleTxt = 'Quantitative Investment Society';
const subTxt   = 'UCalgary Division';

let ti = 0;
const tInt = setInterval(() => {
    titleEl.textContent += titleTxt[ti++];
    if (ti === titleTxt.length) {
        clearInterval(tInt);
        setTimeout(() => {
            let si = 0;
            const sInt = setInterval(() => {
                subEl.textContent += subTxt[si++];
                if (si === subTxt.length) clearInterval(sInt);
            }, 55);
        }, 300);
    }
}, 45);

// ── Fade-up observer
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.1 }
);
document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));

// Hero fade-ups trigger early after typing starts
setTimeout(() => {
    document.querySelectorAll('.hero .fade-up').forEach(el => el.classList.add('visible'));
}, 800);

// ── Counting animation for stat pills
function animateCount(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = target > 100 ? 1800 : 1200;
    const steps = 60;
    let step = 0;
    el.textContent = '0' + suffix;
    const timer = setInterval(() => {
        step++;
        el.textContent = Math.min(Math.round(target / steps * step), target) + suffix;
        if (step >= steps) clearInterval(timer);
    }, duration / steps);
}

let counted = false;
const countObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting && !counted) {
            counted = true;
            setTimeout(() => {
                document.querySelectorAll('.count-num').forEach(el => animateCount(el));
            }, 900);
        }
    });
}, { threshold: 0.6 });
const statsEl = document.querySelector('.hero-stats');
if (statsEl) countObs.observe(statsEl);

// ── Role cards — slide in from right, RESET every time section leaves viewport
const roleObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const delay = parseInt(e.target.dataset.delay || 0, 10);
            setTimeout(() => e.target.classList.add('slide-in'), delay);
        } else {
            e.target.classList.remove('slide-in');
        }
    });
}, { threshold: 0.25 });
document.querySelectorAll('.role-card').forEach(c => roleObs.observe(c));