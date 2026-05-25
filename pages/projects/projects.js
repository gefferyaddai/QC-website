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
// remember to add interactive aspects to the website very important

document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));