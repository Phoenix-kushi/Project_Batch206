console.log("JS Loaded");

/* =========================================
   GLOBAL VARIABLES
========================================= */
let quantity = 1;


/* =========================================
   ADD TO CART (WITH STORAGE)
========================================= */
function addToCart(name, price) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let existing = cart.find(item => item.name === name);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            name: name,
            price: parseInt(price.replace(/[^\d]/g, "")),
            qty: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    console.log("Cart saved:", cart);

    updateCartCount();   // 🔥 MUST BE HERE

    alert("✅ " + name + " added to cart!");
}


/* =========================================
   VIEW PRODUCT PAGE
========================================= */
function loadProductDetails() {

    const params = new URLSearchParams(window.location.search);

    const name = params.get("name");
    const price = params.get("price");
    const img = params.get("img");

    if (document.getElementById("product-name")) {

        document.getElementById("product-name").innerText = name;
        document.getElementById("product-price").innerText = "Rs." + price;
        document.getElementById("product-img").src = img;

        // store for cart
        window.currentProduct = { name, price };

        console.log("Loaded product:", window.currentProduct);
    }
}


/* =========================================
   ADD TO CART FROM VIEW PAGE
========================================= */
function addToCartFromView() {

    const params = new URLSearchParams(window.location.search);

    const name = params.get("name");
    const price = params.get("price");

    if (!name || !price) {
        alert("❌ Product data missing");
        return;
    }

    addToCart(name, "Rs." + price);

    updateCartCount();   // ✅ ensures instant update
}
/* =========================================
   QUANTITY CONTROLS
========================================= */
function increaseQty() {
    quantity++;
    document.getElementById("qty").innerText = quantity;
}

function decreaseQty() {
    if (quantity > 1) {
        quantity--;
        document.getElementById("qty").innerText = quantity;
    }
}


/* =========================================
   LOAD CART PAGE
========================================= */
function loadCart() {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartBody = document.getElementById("cart-body");

    if (!cartBody) return;

    cartBody.innerHTML = "";

    if (cart.length === 0) {
        cartBody.innerHTML = `
            <tr>
                <td colspan="5">Your cart is empty</td>
            </tr>
        `;
        return;
    }

    let subtotal = 0;

   cart.forEach((item, index) => {

        let total = item.price * item.qty;
        subtotal += total;

        cartBody.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>Rs. ${item.price}</td>
                <td>${item.qty}</td>
                <td>Rs. ${total}</td>
                <td>
                    <button onclick="removeItem(${index})">Remove</button>
                </td>
            </tr>
        `;
    });

    // totals
    let tax = subtotal * 0.18;
    let grand = subtotal + tax;

    if (document.getElementById("subtotal")) {
        document.getElementById("subtotal").innerText = "Rs. " + subtotal;
        document.getElementById("tax").innerText = "Rs. " + tax.toFixed(2);
        document.getElementById("grand-total").innerText = "Rs. " + grand.toFixed(2);
    }
}

/* =========================================
   INIT (RUN ON PAGE LOAD)
========================================= */
window.onload = function () {
    loadProductDetails();
    loadCart();
    updateCartCount(); 
};

function updateCartCount() {

    console.log("updateCartCount running...");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let count = cart.reduce((total, item) => total + item.qty, 0);

    console.log("Cart count:", count);

    // header
    let header = document.getElementById("cart-count");
    if (header) {
        header.innerText = "(" + count + ")";
        console.log("Header updated");
    } else {
        console.log("Header NOT found ❌");
    }

    // cart page heading
    let page = document.getElementById("cart-page-count");
    if (page) {
        page.innerText = "(" + count + ")";
        console.log("Cart page heading updated");
    }
}

function removeItem(index) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cart));

    loadCart();
    updateCartCount();
}
function checkout() {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("🛒 Your cart is empty!");
        return;
    }

    // ask address
    let address = prompt("📍 Enter your delivery address:");

    if (!address || address.trim() === "") {
        alert("❌ Address is required!");
        return;
    }

    // confirm order
    alert("✅ Order placed successfully!\n\n" +
          "📦 Your items will be delivered to:\n" + address +
          "\n\n💳 Please pay via card/cash on delivery.");

    // clear cart
    localStorage.removeItem("cart");

    // refresh UI
    loadCart();
    updateCartCount();
}

function sendMessage() {

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let message = document.getElementById("message").value;

    if (!name || !email || !message) {
        alert("❌ Please fill all fields!");
        return;
    }

    document.getElementById("success-msg").style.display = "block";

    // clear fields
    document.getElementById("name").value = "";
    document.getElementById("email").value = "";
    document.getElementById("message").value = "";
}