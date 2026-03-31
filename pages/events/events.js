// ── Nav scroll shadow
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40));

// ── Fade-up observer (matches about.js)
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

// ── COUNTDOWN —
// Example: const TARGET = new Date('2026-04-18T18:00:00-06:00');
const TARGET = null;

function updateCountdown() {
    if (!TARGET) return;
    const diff = TARGET - Date.now();
    if (diff <= 0) {
        document.getElementById('countdownNote').textContent = 'This event has passed!';
        return;
    }
    document.getElementById('countdownNote').style.display = 'none';
    document.getElementById('cdDays').textContent    = String(Math.floor(diff / 86400000)).padStart(2, '0');
    document.getElementById('cdHours').textContent   = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
    document.getElementById('cdMinutes').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
    document.getElementById('cdSeconds').textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
}
if (TARGET) { updateCountdown(); setInterval(updateCountdown, 1000); }

// ── Notify modal
const modal = document.getElementById('notifyModal');
document.getElementById('notifyBtn').addEventListener('click', () => modal.classList.add('open'));
document.getElementById('notifyClose').addEventListener('click', () => modal.classList.remove('open'));
modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });
document.getElementById('notifyForm').addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('notifyFormState').style.display = 'none';
    document.getElementById('notifySuccessState').style.display = 'block';
});