const form = document.querySelector("#human-need-form");
const textarea = document.querySelector("#human-need");

if (form && textarea) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const idea = textarea.value.trim();
    const subject = encodeURIComponent("A human need for Good Business");
    const body = encodeURIComponent(
      idea
        ? `What should technology make more human?\n\n${idea}`
        : "What should technology make more human?\n\n"
    );

    window.location.href = `mailto:hello@goodbusinesshq.com?subject=${subject}&body=${body}`;
  });
}
