const slides = document.querySelectorAll('.slide');
const dotsContainer = document.querySelector('.dots');

if (slides.length > 0) {  let current = 0;
  let timer;
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });
  function getDots() {
    return document.querySelectorAll('.dot');
  }
  function goToSlide(n) {
    const dots = getDots();
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    resetTimer();
  }
  function changeSlide(dir) {
    goToSlide(current + dir);
  }
  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => changeSlide(1), 4000);
  }
  resetTimer();

}


let container = document.getElementById("best-seller")
if (container) {
  fetch("https://api.everrest.educata.dev/shop/products/all?page_size=36")
    .then(res => res.json())
    .then(data => {
      const product = data.products
      .sort((a,b) =>b.rating - a.rating)
      .slice(0, 6)
      product.forEach(product => {
        container.innerHTML += `
        <div class="card" onclick="openProduct('${product._id}')">
        <img src="${product.thumbnail}"referrerpolicy="no-referrer">
        <div class="img1"></div>
        <h3 class="sec1h">${product.title}</h3>
        <p class="${product.title === 'Samsung A546E Galaxy A54 (6GB/128GB) Dual Sim LTE/5G - Black' ? 'green' : 'stock'}">
          ${product.stock} stock
        </p>
        <p class="sec1p">$${product.price.current}</p>
        <p class="sec1p2">⭐${product.rating}</p>
        <button class="cbutton" ${product.stock <= 0 ? "disabled" : ""}>
          Add To Cart
        </button>
        </div>      `
      })
    });
}
const searchInput = document.getElementById("search");
searchInput.addEventListener("input", searchProducts);
async function searchProducts() {
  const value = searchInput.value;
  const response = await fetch(
    `https://api.everrest.educata.dev/shop/products/search?brand=${value}`
  );
  const data = await response.json();
  displayProducts(data.products);
}
function displayProducts(products) {
  allProductContainer.innerHTML = "";
  products.forEach(product => {
    allProductContainer.innerHTML += `
      <div class="card1">
        <img src="${product.thumbnail}" class="cimg1">
        <h3 class="ch3">${product.title}</h3>
        <p class="${product.title === 'Samsung A546E Galaxy A54 (6GB/128GB) Dual Sim LTE/5G - Black' ? 'green' : 'stock'}">
          ${product.stock} stock
        </p>
        <p class="cp1">$${product.price.current}</p>
        <p class="cp2">⭐ ${product.rating}</p>
        <button class="cbutton" ${product.stock <= 0 ? "disabled" : ""}>
          Add To Cart
        </button>
      </div>
    `;
  });
}
async function searchProducts() {

  const value = searchInput.value;

  if (value === "") {
    loadProducts(1);
    return;
  }

  const response = await fetch(
    `https://api.everrest.educata.dev/shop/products/search?brand=${value}`
  );

  const data = await response.json();

  displayProducts(data.products);

}
function openProduct(id) {
  window.location.href = `/html/product.html?id=${id}`;
}
