const products = [
  {
    name: "Pardners",
    description: "Meet people through shared interests and real-world events.",
    category: "Connection",
    status: "In development",
  },
  {
    name: "FoodPersonal",
    description: "Personal AI meal planning that helps people make better food choices.",
    category: "Food",
    status: "In development",
  },
  {
    name: "Rated JC",
    description: "Search movies and shows before you watch.",
    category: "Entertainment choices",
    status: "In development",
  },
  {
    name: "SideStage",
    description: "Relive live music through the people who were there.",
    category: "Music and memory",
    status: "In development",
  },
  {
    name: "Prayer Text",
    description: "Encourage people through simple prayer messages.",
    category: "Care and faith",
    status: "Concept",
  },
  {
    name: "Race to Revelation",
    description: "A daily Bible trivia race through Scripture.",
    category: "Faith and learning",
    status: "Concept",
  },
];

const productGrid = document.querySelector("#product-grid");
const productPreviewList = document.querySelector("#product-preview-list");
const footerProducts = document.querySelector("#footer-products");

if (productGrid) {
  productGrid.innerHTML = products.map(renderProductCard).join("");
}

if (productPreviewList) {
  productPreviewList.innerHTML = products.map((product) => `<li>${escapeHtml(product.name)}</li>`).join("");
}

if (footerProducts) {
  footerProducts.textContent = products.map((product) => product.name).join(" / ");
}

function renderProductCard(product) {
  return `
    <article class="product-card" data-product="${escapeHtml(product.name)}">
      <div class="product-card-header">
        <span>${escapeHtml(product.category)}</span>
        <span>${escapeHtml(product.status)}</span>
      </div>
      <h3>${escapeHtml(product.name)}</h3>
      <p>${escapeHtml(product.description)}</p>
    </article>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
