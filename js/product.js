const params = new URLSearchParams(window.location.search)
const productId = params.get("id")

fetch(`https://api.everrest.educata.dev/shop/products/id/${productId}`)
    .then(res => res.json())
    .then(product => {
        const token = localStorage.getItem("token");
        const isLoggedIn = !!token;
        const savedRating = Number(localStorage.getItem(`rating_${product._id}`)) || 0;

        document.getElementById("product").innerHTML = `
            <div class="productpage">          
                <div class="product-left">
                    <img src="${product.thumbnail}" class="productimg">
                </div>           
                <div class="product-right">          
                    <h1 class="ph1">${product.title}</h1>           
                    <p class="price">Price: $${product.price.current}</p>           
                    <p class="rating">⭐ ${Math.round(product.rating)}</p>        
                    <p class="${product.stock > 0 ? 'pgreen' : 'pstock'}">
                        ${Math.max(0, product.stock)} stock
                    </p>
                    <h3 class="ph3">Description</h3>
                    <p class="description">${product.description}</p>
                    <button onclick="addToCart('${product._id}')"
                      class="abutton" ${product.stock <= 0 ? "disabled" : ""}>
                      Add To Cart
                    </button>

                    <!-- რეიტინგის სექცია -->
                    <div class="rating-section">
                        <h3 class="ph3">შეაფასე პროდუქტი</h3>
                        ${isLoggedIn ? `
                            <div class="stars" id="stars">
                                <span class="star" data-value="1">★</span>
                                <span class="star" data-value="2">★</span>
                                <span class="star" data-value="3">★</span>
                                <span class="star" data-value="4">★</span>
                                <span class="star" data-value="5">★</span>
                            </div>
                            <p id="rating-label" class="rating-label">აირჩიე შეფასება</p>
                            <button id="rate-btn" class="rate-btn" onclick="submitRating('${product._id}')">
                                შეფასების გაგზავნა
                            </button>
                            <p id="rating-msg" class="rating-msg"></p>
                        ` : `
                            <p class="rating-login-msg">
                                შეფასებისთვის გთხოვთ 
                                <a href="./sign-in.html">შეხვიდეთ</a> სისტემაში.
                            </p>
                        `}
                    </div>
                </div> 
            </div>
        `;

        if (isLoggedIn) {
            initStars(savedRating);
        }
    });

let selectedRating = 0;

function initStars(savedRating = 0) {
    const stars = document.querySelectorAll(".star");
    if (savedRating > 0) {
        selectedRating = savedRating;
        highlightStars(savedRating);
        document.getElementById("rating-label").textContent = `შენი შეფასება: ${savedRating} / 5`;
        document.getElementById("rating-msg").textContent = " უკვე შეაფასე ეს პროდუქტი";
        document.getElementById("rating-msg").style.color = "green";
    } else {
        document.getElementById("rate-btn").disabled = true;
    }
    stars.forEach(star => {
        star.addEventListener("mouseenter", () => {
            highlightStars(Number(star.dataset.value));
        });
        star.addEventListener("mouseleave", () => {
            highlightStars(selectedRating);
        });
        star.addEventListener("click", () => {
            selectedRating = Number(star.dataset.value);
            highlightStars(selectedRating);
            document.getElementById("rating-label").textContent = `შენი შეფასება: ${selectedRating} / 5`;
            document.getElementById("rate-btn").disabled = false;
            document.getElementById("rating-msg").textContent = "";
        });
    });
}

function highlightStars(count) {
    document.querySelectorAll(".star").forEach(s => {
        s.classList.toggle("active", Number(s.dataset.value) <= count);
    });
}

async function submitRating(productId) {
    const token = localStorage.getItem("token");

    if (!selectedRating) {
        alert("გთხოვთ აირჩიოთ შეფასება");
        return;
    }

    const btn = document.getElementById("rate-btn");
    btn.disabled = true;
    btn.textContent = "იგზავნება...";
    try {
        const res = await fetch("https://api.everrest.educata.dev/shop/products/rate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                productId: productId,
                rate: selectedRating
            })
        });

        const data = await res.json();
        const msg = document.getElementById("rating-msg");

        if (res.ok) {
            localStorage.setItem(`rating_${productId}`, selectedRating);

            msg.textContent = " შეფასება წარმატებით გაიგზავნა!";
            msg.style.color = "green";
            btn.textContent = "შეფასება გაგზავნილია";
        } else if (res.status === 401) {
            msg.textContent = " გთხოვთ ხელახლა შეხვიდეთ სისტემაში.";
            msg.style.color = "red";
            btn.disabled = false;
            btn.textContent = "შეფასების გაგზავნა";
        } else {
            msg.textContent = " " + (data.message || data.error || "შეცდომა მოხდა");
            msg.style.color = "red";
            btn.disabled = false;
            btn.textContent = "შეფასების გაგზავნა";
        }
    } catch (err) {
        console.error(err);
        document.getElementById("rating-msg").textContent = " კავშირის შეცდომა";
        document.getElementById("rating-msg").style.color = "red";
        btn.disabled = false;
        btn.textContent = "შეფასების გაგზავნა";
    }
}