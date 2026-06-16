const form = document.querySelector("#contact-form");
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#site-nav");
const navLinks = nav ? nav.querySelectorAll("a") : [];

setupMotion();
setupHeader();
setupMobileMenu();

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = form.querySelector("#contact-name")?.value.trim() || "";
    const email = form.querySelector("#contact-email")?.value.trim() || "";
    const message = form.querySelector("#contact-message")?.value.trim() || "";

    if (!email || !message) {
      return;
    }

    const subject = encodeURIComponent("AI consulting inquiry");
    const bodyParts = [
      name ? `Name: ${name}` : "",
      `Email: ${email}`,
      "",
      `Message:\n${message}`,
    ];

    const body = encodeURIComponent(bodyParts.join("\n"));

    window.location.href = `mailto:hello@goodbusinesshq.com?subject=${subject}&body=${body}`;
  });
}

function setupMobileMenu() {
  if (!menuToggle || !nav) {
    return;
  }

  const closeMenu = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    nav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  };

  const openMenu = () => {
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close menu");
    nav.classList.add("is-open");
    document.body.classList.add("menu-open");
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 700) {
      closeMenu();
    }
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
