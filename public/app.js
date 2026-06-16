const form = document.querySelector("#contact-form");
const header = document.querySelector(".site-header");

setupMotion();
setupHeader();

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = form.querySelector("#contact-name")?.value.trim() || "";
    const email = form.querySelector("#contact-email")?.value.trim() || "";
    const message = form.querySelector("#contact-message")?.value.trim() || "";

    const subject = encodeURIComponent("AI consulting inquiry");
    const bodyParts = [
      name ? `Name: ${name}` : "",
      email ? `Email: ${email}` : "",
      "",
      message ? `Message:\n${message}` : "",
    ].filter((part, index, arr) => part || (index === 2 && arr.some(Boolean)));

    const body = encodeURIComponent(bodyParts.join("\n"));

    window.location.href = `mailto:hello@goodbusinesshq.com?subject=${subject}&body=${body}`;
  });
}

function setupMotion() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const revealItems = [
    ".site-header",
    ".hero-copy",
    ".hero-visual",
    ".section-header",
    ".moment-photo",
    ".moment-grid article",
    ".philosophy-photo",
    ".philosophy-panel",
    ".principles-photo",
    ".principles-content",
    ".begin-copy",
    ".contact-form",
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
    { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
  );

  elements.forEach((element) => observer.observe(element));
}

function setupHeader() {
  if (!header) {
    return;
  }

  const updateHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}
