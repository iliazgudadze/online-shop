const slides = document.querySelectorAll('.slide');
const dotsContainer = document.querySelector('.dots');

if (slides.length > 0) {
  let current = 0;
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

const searchInput = document.getElementById("search");
const searchDropdown = document.getElementById("search-dropdown");

if (searchInput && searchDropdown) {
  searchInput.addEventListener("input", async () => {
    const value = searchInput.value.trim();

    if (value === "") {
      searchDropdown.innerHTML = "";
      searchDropdown.style.display = "none";
      return;
    }

    const res = await fetch(`https://api.everrest.educata.dev/shop/products/search?keywords=${value}`);
    const data = await res.json();
    const products = data.products || [];

    if (products.length === 0) {
      searchDropdown.style.display = "none";
      return;
    }

    searchDropdown.innerHTML = products.slice(0, 5).map(p => `
      <div class="search-item" onclick="openProduct('${p._id}')">
        <img src="${p.thumbnail}" alt="${p.title}">
        <div>
          <p>${p.title}</p>
          <span>${p.price.current}$</span>
        </div>
      </div>
    `).join("");

    searchDropdown.style.display = "block";
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-wrapper")) {
      searchDropdown.style.display = "none";
    }
  });
}

let container = document.getElementById("best-seller");
if (container) {
  fetch("https://api.everrest.educata.dev/shop/products/all?page_size=36")
    .then(res => res.json())
    .then(data => {
      const product = data.products
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6);
      product.forEach(product => {
        container.innerHTML += `
        <div class="card" onclick="openProduct('${product._id}')">
          <img src="${product.thumbnail}" referrerpolicy="no-referrer">
          <div class="img1"></div>
          <h3 class="sec1h">${product.title}</h3>
          <p class="stock">${Math.max(0, product.stock)} stock</p>
          <p class="sec1p">$${product.price.current}</p>
          <p class="sec1p2">⭐${product.rating}</p>
          <button class="cbutton" ${product.stock <= 0 ? "disabled" : ""}>
            Add To Cart
          </button>
        </div>`;
      });
    });
}

function openProduct(id) {
  window.location.href = `/html/product.html?id=${id}`;
}