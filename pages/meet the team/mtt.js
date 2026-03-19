// Scroll fade-in animation
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));

document.querySelectorAll('.member-card').forEach((card) => {
  const nameEl  = card.querySelector('.member-name');
  const avatar  = card.querySelector('.avatar');

  if (!nameEl || !avatar) return;

  const syncInitials = () => {
    const name = nameEl.textContent.trim();
    if (!name) return;

    const parts    = name.split(/\s+/).filter(Boolean);
    const initials = parts.length >= 2
      ? parts[0][0] + parts[parts.length - 1][0]
      : parts[0]?.slice(0, 2) ?? '--';

    avatar.dataset.initials = initials.toUpperCase();
  };

  syncInitials();

  // Re-sync if name content changes (useful during dev)
  const mo = new MutationObserver(syncInitials);
  mo.observe(nameEl, { characterData: true, childList: true, subtree: true });
});