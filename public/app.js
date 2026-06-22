const header = document.querySelector(".site-header");

setupMotion();
setupHeader();

function setupMotion() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = [
    ".site-header",
    ".hero-copy",
    ".hero-visual",
    ".section-header",
    ".moment-photo",
    ".moment-grid article",
    ".projects-section .section-header",
    ".project-card",
    ".philosophy-photo",
    ".philosophy-panel",
    ".principles-photo",
    ".principles-content",
    ".begin-copy",
    ".contact-options",
  ];

  const elements = document.querySelectorAll(revealItems.join(","));

  if (reduceMotion || !("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  document.documentElement.classList.add("motion-ready");

  elements.forEach((element, index) => {
    element.classList.add("reveal");
    element.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 70}ms`);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );

  elements.forEach((element) => observer.observe(element));
}

function setupHeader() {
  if (!header) {
    return;
  }

  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}
