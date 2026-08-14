function syncInitials(card) {
    const nameEl = card.querySelector('.member-name');
    const avatar = card.querySelector('.avatar');
    if (!nameEl || !avatar) return;

    const name = nameEl.textContent.trim();
    if (!name) return;

    const parts = name.split(/\s+/).filter(Boolean);
    const initials = parts.length >= 2
        ? parts[0][0] + parts[parts.length - 1][0]
        : parts[0]?.slice(0, 2) ?? '--';

    avatar.dataset.initials = initials.toUpperCase();
}

export function init(root) {
    root.querySelectorAll('.member-card').forEach(syncInitials);
}

export function destroy() {}
