async function loadCart() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("გთხოვთ გაიაროთ ავტორიზაცია");
        window.location.href = "./sign-in.html";
        return;
    }

    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "block";

    try {
        const res = await fetch("https://api.everrest.educata.dev/shop/cart", {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        console.log("Cart data:", data);

        if (res.ok) {
            await renderCart(data);
            updateCartCount(data.products ? data.products.length : 0);
        } else {
            const container = document.getElementById("cart-container");
            if (container) container.innerHTML = "<p>კალათა ცარიელია</p>";
        }
    } catch (err) {
        console.error("Cart load error:", err);
    } finally {
        if (loader) loader.style.display = "none";
    }
}


async function renderCart(data) {
    const container = document.getElementById("cart-container");
    if (!container) return;

    if (!data.products || data.products.length === 0) {
        container.innerHTML = "<p>კალათა ცარიელია</p>";
        updateTotal(0);
        return;
    }

    const items = await Promise.all(
        data.products.map(async (item) => {
            try {
                const res = await fetch(`https://api.everrest.educata.dev/shop/products/id/${item.productId}`);
                const product = await res.json();
                return { ...item, product };
            } catch {
                return { ...item, product: null };
            }
        })
    );

    let total = 0;

    container.innerHTML = items.map(item => {
        if (!item.product) return "";
        total += item.product.price.current * item.quantity;
        return `
        <div class="cart-item" style="display:flex; gap:16px; margin-bottom:16px; border-bottom:1px solid #eee; padding-bottom:16px; align-items:center;">
            <img src="${item.product.thumbnail}" alt="${item.product.title}" style="width:90px; height:90px; object-fit:cover; border-radius:8px;">
            <div style="flex:1;">
                <h3>${item.product.title}</h3>
                <p>ფასი: $${item.product.price.current}</p>
                <p>რაოდენობა: ${item.quantity}</p>
                <div style="display:flex; gap:8px; margin-top:8px;">
                    <button onclick="decreaseQuantity('${item.productId}', ${item.quantity})" style="padding:4px 10px;">-</button>
                    <span style="padding:4px 10px;">${item.quantity}</span>
                    <button onclick="increaseQuantity('${item.productId}', ${item.quantity})" style="padding:4px 10px;">+</button>
                    <button onclick="removeFromCart('${item.productId}')" style="color:red; margin-left:8px; padding:4px 10px;">წაშლა</button>
                </div>
            </div>
            <p style="font-weight:bold;">$${item.product.price.current * item.quantity}</p>
        </div>
        `;
    }).join("");

    updateTotal(total);
}

function updateTotal(total) {
    const totalEl = document.getElementById("cart-total");
    if (totalEl) totalEl.textContent = `სულ: $${total}`;
}

async function addToCart(productId) {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("კალათაში დასამატებლად გაიარეთ ავტორიზაცია");
        window.location.href = "./sign-in.html";
        return;
    }

    try {
        const res = await fetch("https://api.everrest.educata.dev/shop/cart/product", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ id: productId, quantity: 1 })
        });

        const data = await res.json();
        console.log("Add to cart:", data);

        if (res.ok) {
            alert("პროდუქტი დაემატა კალათაში ✓");
            updateCartCount(data.products ? data.products.length : 0);
        } else {
            alert("შეცდომა: " + (data.message || data.error));
        }
    } catch (err) {
        console.error("Add to cart error:", err);
        alert("კავშირის შეცდომა");
    }
}
async function increaseQuantity(productId, currentQty) {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const res = await fetch("https://api.everrest.educata.dev/shop/cart/product", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ id: productId, quantity: currentQty + 1 })
        });

        const data = await res.json();
        if (res.ok) {
            await renderCart(data);
            updateCartCount(data.products ? data.products.length : 0);
        }
    } catch (err) {
        console.error("Update error:", err);
    }
}

async function decreaseQuantity(productId, currentQty) {
    if (currentQty <= 1) {
        removeFromCart(productId);
        return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const res = await fetch("https://api.everrest.educata.dev/shop/cart/product", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ id: productId, quantity: currentQty - 1 })
        });

        const data = await res.json();
        if (res.ok) {
            await renderCart(data);
            updateCartCount(data.products ? data.products.length : 0);
        }
    } catch (err) {
        console.error("Update error:", err);
    }
}

async function removeFromCart(productId) {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const res = await fetch("https://api.everrest.educata.dev/shop/cart/product", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ id: productId })
        });

        const data = await res.json();
        if (res.ok) {
            await renderCart(data);
            updateCartCount(data.products ? data.products.length : 0);
        }
    } catch (err) {
        console.error("Remove error:", err);
    }
}

async function clearCart() {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!confirm("დარწმუნებული ხართ რომ გსურთ კალათის გასუფთავება?")) return;

    try {
        const res = await fetch("https://api.everrest.educata.dev/shop/cart", {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        if (res.ok) {
            loadCart();
        }
    } catch (err) {
        console.error("Clear cart error:", err);
    }
}

async function checkout() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("გთხოვთ გაიაროთ ავტორიზაცია");
        window.location.href = "./sign-in.html";
        return;
    }

    try {
        const res = await fetch("https://api.everrest.educata.dev/shop/cart/checkout", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        console.log("Checkout:", data);

        if (res.ok) {
            alert("შეკვეთა წარმატებით განხორციელდა!");
            loadCart();
        } else {
            alert("შეცდომა: " + (data.message || data.error));
        }
    } catch (err) {
        console.error("Checkout error:", err);
    }
}

function updateCartCount(count) {
    const cartCount = document.getElementById("cart-count");
    if (cartCount) cartCount.textContent = count;
}

loadCart();