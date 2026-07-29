const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const contactForm = document.querySelector('#contact-form');
const formNote = document.querySelector('.form-note');

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const name = data.get('name');
  const company = data.get('company');
  const email = data.get('email');
  const message = data.get('message');
  const subject = encodeURIComponent(`Good Business inquiry from ${company}`);
  const body = encodeURIComponent(
    `Name: ${name}\nCompany: ${company}\nEmail: ${email}\n\nWhat's not working:\n${message}`
  );

  formNote.textContent = 'Opening your email…';
  window.location.href = `mailto:info@goodbusinesshq.com?subject=${subject}&body=${body}`;
});
