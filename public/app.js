const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
const header = document.querySelector('.site-header');
const progress = document.querySelector('.scroll-progress i');

requestAnimationFrame(() => document.body.classList.add('loaded'));

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reducedMotion) {
  root.classList.add('reveal-ready');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.13 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const story = document.querySelector('.system-story');
const storySticky = document.querySelector('.system-sticky');
const storySteps = [...document.querySelectorAll('.story-step')];
const parallaxItems = [...document.querySelectorAll('.parallax')];
const scrollScenes = [...document.querySelectorAll('.scroll-scene')];
const motionPanels = [...document.querySelectorAll('.motion-panel')];
let ticking = false;

if (!reducedMotion) root.classList.add('motion-ready');

function updatePageMotion() {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${maxScroll > 0 ? scrollTop / maxScroll : 0})`;
  header.classList.toggle('scrolled', scrollTop > 42);

  if (!reducedMotion) {
    const heroProgress = Math.max(0, Math.min(1, scrollTop / Math.max(window.innerHeight, 1)));
    root.style.setProperty('--hero-y', `${heroProgress * -75}px`);
    root.style.setProperty('--hero-opacity', String(1 - heroProgress * 0.7));

    parallaxItems.forEach((item) => {
      const rect = item.parentElement.getBoundingClientRect();
      const speed = Number(item.dataset.speed || 0.1);
      const offset = Math.max(-window.innerHeight, Math.min(window.innerHeight, -rect.top));
      item.style.translate = `0 ${offset * speed}px`;
    });

    scrollScenes.forEach((scene) => {
      const rect = scene.getBoundingClientRect();
      const enter = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight * 0.72)));
      const fullJourney = window.innerHeight + rect.height;
      const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / fullJourney));
      const center = 1 - Math.abs(progress * 2 - 1);
      scene.style.setProperty('--scene-opacity', String(0.15 + enter * 0.85));
      scene.style.setProperty('--scene-y', `${(1 - enter) * 72}px`);
      scene.style.setProperty('--scene-scale', String(0.965 + enter * 0.035));
      scene.style.setProperty('--scene-blur', `${(1 - enter) * 10}px`);
      scene.style.setProperty('--scene-line-width', `${enter * 88}vw`);
      scene.style.setProperty('--scene-line-opacity', String(0.15 + Math.max(0, center) * 0.65));
    });

    motionPanels.forEach((panel) => {
      const rect = panel.getBoundingClientRect();
      const enter = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight * 0.68)));
      panel.style.setProperty('--panel-opacity', String(0.12 + enter * 0.88));
      panel.style.setProperty('--panel-y', `${(1 - enter) * 90}px`);
      panel.style.setProperty('--panel-scale', String(0.96 + enter * 0.04));
      panel.style.setProperty('--panel-blur', `${(1 - enter) * 8}px`);
      panel.style.setProperty('--panel-x', `${(1 - enter) * 8}%`);
      panel.style.setProperty('--panel-x-reverse', `${(1 - enter) * -8}%`);
      panel.style.setProperty('--panel-visual-scale', String(0.94 + enter * 0.06));
      panel.style.setProperty('--panel-clip', `${(1 - enter) * 18}%`);
    });

    if (story && window.innerWidth > 760) {
      const rect = story.getBoundingClientRect();
      const travel = Math.max(1, story.offsetHeight - window.innerHeight);
      const value = Math.max(0, Math.min(0.999, -rect.top / travel));
      const active = Math.min(2, Math.floor(value * 3));
      storySticky.dataset.active = String(active);
      storySteps.forEach((step, index) => step.classList.toggle('active', index === active));
    }
  }
  ticking = false;
}

function requestMotionUpdate() {
  if (!ticking) {
    requestAnimationFrame(updatePageMotion);
    ticking = true;
  }
}
window.addEventListener('scroll', requestMotionUpdate, { passive: true });
window.addEventListener('resize', requestMotionUpdate);
updatePageMotion();

if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.magnetic').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      element.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px)`;
    });
    element.addEventListener('pointerleave', () => { element.style.transform = 'translate(0, 0)'; });
  });
}

const contactForm = document.querySelector('#contact-form');
const formNote = document.querySelector('.form-note');
const submitButton = contactForm?.querySelector('button[type="submit"]');
contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity() || submitButton.disabled) return;
  const data = Object.fromEntries(new FormData(contactForm));
  const originalButton = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.querySelector('span').textContent = 'Sending…';
  formNote.textContent = '';
  try {
    const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'We couldn’t send that message.');
    contactForm.reset();
    submitButton.querySelector('span').textContent = 'Message sent';
    formNote.textContent = 'Thanks. We’ll be in touch.';
    setTimeout(() => { submitButton.innerHTML = originalButton; submitButton.disabled = false; formNote.textContent = ''; }, 5000);
  } catch (error) {
    submitButton.innerHTML = originalButton;
    submitButton.disabled = false;
    formNote.textContent = error instanceof Error ? error.message : 'We couldn’t send that message. Please email info@goodbusinesshq.com.';
  }
});
