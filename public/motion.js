const revealItems = document.querySelectorAll('.reveal, .reveal-line');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index % 3, 2) * 90}ms`;
  observer.observe(item);
});

requestAnimationFrame(() => {
  document.querySelectorAll('.hero .reveal').forEach((item, index) => {
    setTimeout(() => item.classList.add('visible'), 120 + index * 120);
  });
});

const phrases = ['their software.', 'old workarounds.', 'someone else’s rules.'];
const swapWord = document.querySelector('#swap-word');
let phraseIndex = 0;

if (swapWord && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  setInterval(() => {
    swapWord.classList.add('out');
    setTimeout(() => {
      phraseIndex = (phraseIndex + 1) % phrases.length;
      swapWord.textContent = phrases[phraseIndex];
      swapWord.classList.remove('out');
    }, 360);
  }, 2800);
}

const heroImage = document.querySelector('.hero-image');
const hero = document.querySelector('.hero');

if (hero && heroImage && window.matchMedia('(pointer: fine)').matches) {
  hero.addEventListener('pointermove', (event) => {
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;
    heroImage.style.translate = `${x * -10}px ${y * -8}px`;
  });

  hero.addEventListener('pointerleave', () => {
    heroImage.style.translate = '0 0';
  });
}

if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.magnetic').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      element.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px)`;
    });

    element.addEventListener('pointerleave', () => {
      element.style.transform = 'translate(0, 0)';
    });
  });
}
