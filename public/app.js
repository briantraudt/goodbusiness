const form = document.querySelector("#project-form");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const lines = [
      ["What does your business do?", data.get("business")],
      ["What process or problem are you trying to improve?", data.get("problem")],
      ["What systems are involved today?", data.get("systems")],
      ["What would a successful outcome look like?", data.get("outcome")],
      ["What is your expected timing?", data.get("timing")],
    ];

    const body = lines
      .map(([label, value]) => `${label}\n${String(value || "").trim() || "Not sure yet."}`)
      .join("\n\n");

    const subject = encodeURIComponent("Good Business project conversation");
    const message = encodeURIComponent(body);
    window.location.href = `mailto:info@goodbusinesshq.com?subject=${subject}&body=${message}`;
  });
}
