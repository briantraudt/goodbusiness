const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('reveal-ready');
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
const submitButton = contactForm?.querySelector('button[type="submit"]');

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity() || submitButton.disabled) return;

  const data = Object.fromEntries(new FormData(contactForm));
  const originalButtonText = submitButton.innerHTML;

  submitButton.disabled = true;
  submitButton.textContent = 'Sending…';
  formNote.textContent = '';
  contactForm.classList.remove('is-success');

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.error || 'We couldn’t send that message.');
    }

    contactForm.reset();
    contactForm.classList.add('is-success');
    submitButton.textContent = 'Message sent ✓';
    formNote.textContent = 'Thanks—we’ll be in touch.';

    setTimeout(() => {
      submitButton.innerHTML = originalButtonText;
      submitButton.disabled = false;
      contactForm.classList.remove('is-success');
      formNote.textContent = '';
    }, 5000);
  } catch (error) {
    submitButton.innerHTML = originalButtonText;
    submitButton.disabled = false;
    formNote.textContent = error instanceof Error
      ? error.message
      : 'We couldn’t send that message. Please email brian@goodbusinesshq.com.';
  }
});
