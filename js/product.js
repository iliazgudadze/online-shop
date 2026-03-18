const params = new URLSearchParams(window.location.search)

const productId = params.get("id")

fetch(`https://api.everrest.educata.dev/shop/products/id/${productId}`)
    .then(res => res.json())
    .then(product => {

        document.getElementById("product").innerHTML = `
            <div class="productpage">          
                <div class="product-left">
                    <img src="${product.thumbnail}" class="productimg">
                </div>           
                <div class="product-right">          
                    <h1 class="ph1">${product.title}</h1>           
                    <p class="price">Price: $${product.price.current}</p>           
                    <p class="rating">⭐ ${product.rating}</p>          
                    <p class="${product.title === 'Samsung A546E Galaxy A54 (6GB/128GB) Dual Sim LTE/5G - Black' ? 'pgreen' : 'pstock'}">
                      ${product.stock} stock
                    </p>
                    <h3 class="ph3" >Description</h3>
                    <p class="description">${product.description}</p>
                    <button onclick="addToCart('${product._id}')"
                      class="button ${product.stock <= 0 ? "disabled" : ""}">
                      Add To Cart
                    </button>
                </div> 
            </div>
            `
    })