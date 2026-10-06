let modal = null;
let notifyBtn = null;
let notifyClose = null;
let notifyForm = null;
let nameInput = null;
const handlers = {};

export function init(root) {
    modal = root.querySelector('#notifyModal');
    notifyBtn = root.querySelector('#notifyBtn');
    notifyClose = root.querySelector('#notifyClose');
    notifyForm = root.querySelector('#notifyForm');
    nameInput = root.querySelector('#notifyName');

    if (!modal || !notifyBtn || !notifyClose || !notifyForm) return;

    handlers.open = () => {
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
    notifyBtn = null;
    notifyClose = null;
    notifyForm = null;
    nameInput = null;
}
