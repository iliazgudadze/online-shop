const containers = document.getElementById('shop1')
if (containers) {
  fetch("https://api.everrest.educata.dev/shop/products/categories")
    .then(res => res.json())
    .then(data => {
      containers.innerHTML = `
    <div class="filter-item" onclick="toggleFilter(this)">
      <span>Category</span>
      <span class="filter-icon">+</span>
    </div>
    <div class="filter-content">${data.map(category => `
      <div class="filter-option" onclick="loadCategory(${category.id})">
        <img src="${category.image}" alt="${category.name}">
        <span>${category.name}</span>
      </div>
      `).join("")}
    </div>
  `
    })
}
 
function loadCategory(id) {
  allProductContainer.innerHTML = "";
  fetch(`https://api.everrest.educata.dev/shop/products/category/${id}?page_size=50`)
    .then(res => res.json())
    .then(data => {
      data.products.forEach(product => {
        allProductContainer.innerHTML += buildCard(product);
      });
    });
}
 
const containers2 = document.getElementById('shop2')
if (containers2) {
  fetch('https://api.everrest.educata.dev/shop/products/brands')
    .then(res => res.json())
    .then(data => {
      containers2.innerHTML = `
     <div class="filter-item" onclick="toggleFilter(this)">
       <span>Brand</span>
       <span class="filter-icon">+</span>
     </div>
     <div class="filter-content">
       ${data.map(brand => `
          <div class="filter-option" onclick="loadBrand('${brand}')">
            <span>${brand}</span>
          </div>
        `).join("")}
     </div>
    `
    })
}
 
function loadBrand(brand) {
  allProductContainer.innerHTML = "";
  fetch(`https://api.everrest.educata.dev/shop/products/search?brand=${brand}&page_size=50`)
    .then(res => res.json())
    .then(data => {
      data.products.forEach(product => {
        allProductContainer.innerHTML += buildCard(product);
      });
    });
}

const containers3 = document.getElementById('shop3')
if (containers3){
  fetch('https://api.everrest.educata.dev/shop/products/rate')
    .then(res => res.json())
    .then(data =>{
      containers3.innerHTML=`
        <div class="filter-item" onclick="toggleFilter(this)">
          <span>rate</span>
          <span class="filter-icon">+</span>
        </div>
        <div class="filter-content">
          ${[1, 2, 3, 4, 5].map(rate => `
            <div class="filter-option" onclick="loadByRating(${rate})">
              <span>${'⭐'.repeat(rate)} (${rate})</span>
            </div>
          `).join("")}
        </div>
      `;
    })
}

function loadByRating(Rating) {
  allProductContainer.innerHTML = "";
  fetch(`https://api.everrest.educata.dev/shop/products/all?page_index=1&page_size=20`)
    .then(res => res.json())
    .then(data => {
      const filtered = data.products.filter(p => Math.round(p.rating) <= Rating);
      if (filtered.length === 0) {
        allProductContainer.innerHTML = "";
        return;
      }
      filtered.forEach(product => {
        allProductContainer.innerHTML += buildCard(product);
      });
    });
}
 
function toggleFilter(el) {
  const content = el.nextElementSibling
  const icon = el.querySelector('.filter-icon')
  const isOpen = content.classList.contains('open')
  content.classList.toggle('open')
  icon.textContent = isOpen ? '+' : '-'
}
 
const allProductContainer = document.getElementById("allproduct");
 
function buildCard(product) {
  const stockClass = product.stock > 0 ? 'stock' : 'stock';
  const disabled = product.stock <= 0 ? 'disabled' : '';
  return `
    <div class="card1" onclick="openProduct('${product._id}')">
      <img src="${product.thumbnail}" class="cimg1" referrerpolicy="no-referrer">
      <h3 class="ch3">${product.title}</h3>
      <p class="${product.title === 'Samsung A546E Galaxy A54 (6GB/128GB) Dual Sim LTE/5G - Black' ? 'green' : 'stock'}">
        ${Math.max(0, product.stock)} stock
      </p>
      <p class="cp1">${product.price.current}$</p>
      <p class="cp2">⭐ ${product.rating}</p>
      <button onclick="event.stopPropagation(); addToCart('${product._id}')"
        class="cbutton ${disabled}">
          Add To Cart
      </button>
    </div>
  `;
}
 
function loadProducts(page) {
  allProductContainer.innerHTML = "";
  fetch(`https://api.everrest.educata.dev/shop/products/all?page_index=${page}&page_size=9`)
    .then(res => res.json())
    .then(data => {
      data.products.forEach(product => {
        allProductContainer.innerHTML += buildCard(product);
      });
    });
}
 
function changePage(page) {
  loadProducts(page);
}
 
loadProducts(1);
 
const searchInput = document.getElementById("search");
if (searchInput) {
  searchInput.addEventListener("input", searchProducts);
}
 
async function searchProducts() {
  const value = searchInput.value.trim();
 
  if (value === "") {
    loadProducts(1);
    return;
  }
 
  const response = await fetch(
    `https://api.everrest.educata.dev/shop/products/search?keywords=${value}&page_size=50`
  );
  const data = await response.json();
  displayProducts(data.products || []);
}
 
function displayProducts(products) {
  allProductContainer.innerHTML = "";
  if (products.length === 0) {
    allProductContainer.innerHTML = "<p>პროდუქტი ვერ მოიძებნა</p>";
    return;
  }
  products.forEach(product => {
    allProductContainer.innerHTML += buildCard(product);
  });
}
 
function openProduct(id) {
  window.location.href = `/html/product.html?id=${id}`;
}

