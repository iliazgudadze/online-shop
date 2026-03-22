const allProductContainer = document.getElementById("allproduct");

const activeFilters = {
  categoryId: null,
  brand: null,
  rating: null,
};

const containers = document.getElementById('shop1');
if (containers) {
  fetch("https://api.everrest.educata.dev/shop/products/categories")
    .then(res => res.json())
    .then(data => {
      containers.innerHTML = `
        <div class="filter-item" onclick="toggleFilter(this)">
          <span>Category</span>
          <span class="filter-icon">+</span>
        </div>
        <div class="filter-content">
          ${data.map(category => `
            <div class="filter-option" onclick="setFilter('categoryId', ${category.id}, this)">
              <img src="${category.image}" alt="${category.name}">
              <span>${category.name}</span>
            </div>
          `).join("")}
        </div>
      `;
    });
}

const containers2 = document.getElementById('shop2');
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
            <div class="filter-option" onclick="setFilter('brand', '${brand}', this)">
              <span>${brand}</span>
            </div>
          `).join("")}
        </div>
      `;
    });
}

const containers3 = document.getElementById('shop3');
if (containers3) {
  containers3.innerHTML = `
    <div class="filter-item" onclick="toggleFilter(this)">
      <span>Rate</span>
      <span class="filter-icon">+</span>
    </div>
    <div class="filter-content">
      ${[1, 2, 3, 4, 5].map(rate => `
        <div class="filter-option" onclick="setFilter('rating', ${rate}, this)">
          <span>${'⭐'.repeat(rate)} (${rate})</span>
        </div>
      `).join("")}
    </div>
  `;
}

function setFilter(type, value, el) {
  if (activeFilters[type] === value) {
    activeFilters[type] = null;
    el.classList.remove('selected');
  } else {
    const containerId = type === 'categoryId' ? 'shop1' : type === 'brand' ? 'shop2' : 'shop3';
    document.querySelectorAll(`#${containerId} .filter-option.selected`)
      .forEach(opt => opt.classList.remove('selected'));
    activeFilters[type] = value;
    el.classList.add('selected');
  }
  applyFilters(1);
}

async function applyFilters(page = 1) {
  const { categoryId, brand, rating } = activeFilters;

  if (!categoryId && !brand && !rating) {
    loadProducts(1);
    return;
  }

  allProductContainer.innerHTML = "";

  let products = [];

  try {
    if (categoryId) {
      const res = await fetch(
        `https://api.everrest.educata.dev/shop/products/category/${categoryId}?page_size=50`
      );
      const data = await res.json();
      products = data.products || [];
    } else if (brand) {
      const res = await fetch(
        `https://api.everrest.educata.dev/shop/products/search?brand=${brand}&page_size=200`
      );
      const data = await res.json();
      products = data.products || [];
    } else {
      const res = await fetch(
        `https://api.everrest.educata.dev/shop/products/all?page_index=1&page_size=200`
      );
      const data = await res.json();
      products = data.products || [];
    }

    if (categoryId && brand) {
      products = products.filter(p =>
        p.brand && p.brand.toLowerCase() === brand.toLowerCase()
      );
    }

    if (rating) {
      products = products.filter(p => Math.round(p.rating) === rating);
    }

    if (products.length === 0) {
      allProductContainer.innerHTML = "<p style='padding:40px;color:#888;text-align:center'>პროდუქტი ვერ მოიძებნა</p>";
      togglePagination(true);
      return;
    }

    const pageSize = 9;
    const totalPages = Math.ceil(products.length / pageSize);
    const start = (page - 1) * pageSize;
    const paged = products.slice(start, start + pageSize);

    paged.forEach(product => {
      allProductContainer.innerHTML += buildCard(product);
    });

    updatePagination(totalPages, page);

  } catch (err) {
    console.error("Filter error:", err);
  }
}

function updatePagination(totalPages, currentPage) {
  const pagination = document.querySelector(".pagination1");
  if (!pagination) return;

  if (totalPages <= 1) {
    togglePagination(true);
    return;
  }

  togglePagination(false);
  pagination.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = "pagebutton" + (i === currentPage ? " active" : "");
    btn.textContent = i;
    btn.onclick = () => applyFilters(i);
    pagination.appendChild(btn);
  }
}

function togglePagination(hide) {
  const pagination = document.querySelector(".pagination");
  if (pagination) pagination.style.display = hide ? "none" : "flex";
}

function loadProducts(page) {
  allProductContainer.innerHTML = "";
  togglePagination(false);

  fetch(`https://api.everrest.educata.dev/shop/products/all?page_index=${page}&page_size=9`)
    .then(res => res.json())
    .then(data => {
      data.products.forEach(product => {
        allProductContainer.innerHTML += buildCard(product);
      });

      const pagination = document.querySelector(".pagination1");
      if (pagination) {
        pagination.innerHTML = "";
        for (let i = 1; i <= 5; i++) {
          const btn = document.createElement("button");
          btn.className = "pagebutton" + (i === page ? " active" : "");
          btn.textContent = i;
          btn.onclick = () => loadProducts(i);
          pagination.appendChild(btn);
        }
      }
    });
}

loadProducts(1);

function toggleFilter(el) {
  const content = el.nextElementSibling;
  const icon = el.querySelector('.filter-icon');
  const isOpen = content.classList.contains('open');
  content.classList.toggle('open');
  icon.textContent = isOpen ? '+' : '-';
}

function buildCard(product) {
  const disabled = product.stock <= 0 ? 'disabled' : '';
  return `
    <div class="card1" onclick="openProduct('${product._id}')">
      <img src="${product.thumbnail}" class="cimg1" referrerpolicy="no-referrer">
      <h3 class="ch3">${product.title}</h3>
      <p class="${product.stock > 0 ? 'green' : 'stock'}">
        ${Math.max(0, product.stock)} stock
      </p>
      <p class="cp1">${product.price.current}$</p>
      <p class="cp2">⭐ ${Math.round(product.rating)}</p>
      <button onclick="event.stopPropagation(); addToCart('${product._id}')"
        class="sbutton ${disabled}">
          Add To Cart
      </button>
    </div>
  `;
}

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
    togglePagination(true);
    return;
  }
  products.forEach(product => {
    allProductContainer.innerHTML += buildCard(product);
  });
  togglePagination(products.length < 9);
}

function openProduct(id) {
  window.location.href = `/html/product.html?id=${id}`;
}