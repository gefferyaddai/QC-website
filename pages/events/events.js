let modal = null;
let panel = null;
let notifyBtn = null;
let notifyClose = null;
let notifyForm = null;
let nameInput = null;
const handlers = {};

function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

// Anchors the modal's transform-origin to the button that opened it, so the
// panel appears to materialize outward from the trigger rather than the
// viewport center — measurable even while the panel is still invisible,
// since it's gated with opacity/visibility, not display:none.
function setModalOrigin() {
    const t = notifyBtn.getBoundingClientRect();
    const p = panel.getBoundingClientRect();
    if (!p.width || !p.height) return;
    panel.style.setProperty('--origin-x', clamp(((t.left + t.width / 2 - p.left) / p.width) * 100, -40, 140) + '%');
    panel.style.setProperty('--origin-y', clamp(((t.top + t.height / 2 - p.top) / p.height) * 100, -40, 140) + '%');
}

export function init(root) {
    modal = root.querySelector('#notifyModal');
    panel = modal && modal.querySelector('.notify-modal');
    notifyBtn = root.querySelector('#notifyBtn');
    notifyClose = root.querySelector('#notifyClose');
    notifyForm = root.querySelector('#notifyForm');
    nameInput = root.querySelector('#notifyName');

    if (!modal || !notifyBtn || !notifyClose || !notifyForm) return;

    handlers.open = () => {
        setModalOrigin();
        modal.classList.add('open');
        document.addEventListener('keydown', handlers.escape);
        setTimeout(() => nameInput && nameInput.focus(), 0);
    };
    handlers.close = () => {
        modal.classList.remove('open');
        document.removeEventListener('keydown', handlers.escape);
        notifyBtn.focus();
    };
    handlers.escape = (e) => { if (e.key === 'Escape') handlers.close(); };
    handlers.overlay = (e) => { if (e.target === modal) handlers.close(); };
    handlers.submit = (e) => {
        e.preventDefault();
        root.querySelector('#notifyFormState').style.display = 'none';
        root.querySelector('#notifySuccessState').style.display = 'block';
    };

    notifyBtn.addEventListener('click', handlers.open);
    notifyClose.addEventListener('click', handlers.close);
    modal.addEventListener('click', handlers.overlay);
    notifyForm.addEventListener('submit', handlers.submit);
}

export function destroy() {
    if (!modal) return;
    notifyBtn.removeEventListener('click', handlers.open);
    notifyClose.removeEventListener('click', handlers.close);
    modal.removeEventListener('click', handlers.overlay);
    notifyForm.removeEventListener('submit', handlers.submit);
    document.removeEventListener('keydown', handlers.escape);
    modal = null;
    panel = null;
    notifyBtn = null;
    notifyClose = null;
    notifyForm = null;
    nameInput = null;
}
