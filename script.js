// ================================
// 1. PRODUCT DATA
// ================================
// Each product has an ID, name, category, price, description, and image.
const products = [
    {
        id: 1, name: "Spanish latte", category: "Coffee", price: 145,
        description: "Espresso, milk & a little sweetness",
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=85",
        tag: "Bestseller"
    },
    {
        id: 2, name: "Classic latte", category: "Coffee", price: 130,
        description: "Smooth espresso meets silky milk",
        image: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 3, name: "Iced americano", category: "Coffee", price: 110,
        description: "Bold, bright & refreshingly simple",
        image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 4, name: "Caramel macchiato", category: "Coffee", price: 155,
        description: "Vanilla milk, espresso & caramel",
        image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=700&q=85",
        tag: "Sweet pick"
    },
    {
        id: 5, name: "Mocha", category: "Coffee", price: 150,
        description: "Rich chocolate. Real espresso.",
        image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 6, name: "Cold brew", category: "Coffee", price: 135,
        description: "Slow-steeped for 18 smooth hours",
        image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 7, name: "Matcha latte", category: "Non-coffee", price: 145,
        description: "Earthy matcha with creamy milk",
        image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 8, name: "Chocolate milk", category: "Non-coffee", price: 120,
        description: "Creamy chocolate goodness",
        image: "https://images.unsplash.com/photo-1542990253-0b8be8a1f9a5?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 9, name: "Butter croissant", category: "Pastries", price: 85,
        description: "Warm, flaky and freshly baked",
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 10, name: "Chocolate muffin", category: "Pastries", price: 75,
        description: "Soft muffin with chocolate chips",
        image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 11, name: "Coffee & croissant", category: "Combos", price: 205,
        description: "Your favorite latte with a croissant",
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=700&q=85"
    },
    {
        id: 12, name: "Mocha & muffin", category: "Combos", price: 210,
        description: "A sweet pairing for your day",
        image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=700&q=85"
    }
];

// ================================
// 2. VARIABLES AND ELEMENTS
// ================================
let selectedCategory = "Coffee";
let currentView = "menu";
let cart = [];
let favorites = [];
let selectedProduct = null;
let selectedCartId = null;
let nextCartId = 1;

const productGrid = document.getElementById("product-grid");
const cartItems = document.getElementById("cart-items");

// Format a number as Philippine peso currency.
function peso(amount) {
    return "₱" + amount.toFixed(2);
}

// ================================
// 3. DISPLAY PRODUCT CARDS
// ================================
function renderProducts() {
    let visibleProducts = products;

    if (currentView === "favorites") {
        visibleProducts = products.filter(product => favorites.includes(product.id));
    } else if (currentView === "offers") {
        visibleProducts = products.filter(product => product.tag || product.category === "Combos");
    } else {
        visibleProducts = products.filter(product => product.category === selectedCategory);
    }

    const title = document.getElementById("section-title");
    const count = document.getElementById("product-count");

    if (currentView === "favorites") {
        title.textContent = "Your favorite picks";
        count.textContent = visibleProducts.length + " items";
    } else if (currentView === "offers") {
        title.textContent = "Today's special picks";
        count.textContent = visibleProducts.length + " offers";
    } else {
        title.textContent = "Find your daily favorite";
        count.textContent = visibleProducts.length + " items";
    }

    if (visibleProducts.length === 0) {
        productGrid.innerHTML = '<p class="empty-cart">Nothing to show here yet. Tap the heart on a product to save it!</p>';
        return;
    }

    productGrid.innerHTML = visibleProducts.map(product => `
        <article class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ""}
                <button class="favorite-button ${favorites.includes(product.id) ? "is-favorite" : ""}"
                    data-favorite="${product.id}" aria-label="Add ${product.name} to favorites">
                    ${favorites.includes(product.id) ? "♥" : "♡"}
                </button>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <span class="product-price">${peso(product.price)}</span>
                <small class="product-hint">${product.category === "Pastries" ? "Freshly baked" : "Hot or iced · Customize"}</small>
                <button class="add-button" data-add="${product.id}" aria-label="Add ${product.name}">+</button>
            </div>
        </article>
    `).join("");
}

// ================================
// 4. CATEGORY AND SIDEBAR BUTTONS
// ================================
document.querySelectorAll(".category").forEach(button => {
    button.addEventListener("click", () => {
        selectedCategory = button.dataset.category;
        currentView = "menu";

        document.querySelectorAll(".category").forEach(item => item.classList.remove("active"));
        button.classList.add("active");

        document.querySelectorAll(".side-link").forEach(item => item.classList.remove("selected"));
        document.querySelector('[data-view="menu"]').classList.add("selected");

        renderProducts();
    });
});

document.querySelectorAll(".side-link").forEach(button => {
    button.addEventListener("click", () => {
        currentView = button.dataset.view;

        document.querySelectorAll(".side-link").forEach(item => item.classList.remove("selected"));
        button.classList.add("selected");

        if (currentView === "menu") {
            document.querySelectorAll(".category").forEach(item => {
                item.classList.toggle("active", item.dataset.category === selectedCategory);
            });
        } else {
            document.querySelectorAll(".category").forEach(item => item.classList.remove("active"));
        }

        renderProducts();
    });
});

// Event delegation handles Add and Favorite buttons in product cards.
productGrid.addEventListener("click", event => {
    const addButton = event.target.closest("[data-add]");
    const favoriteButton = event.target.closest("[data-favorite]");

    if (addButton) {
        const product = products.find(item => item.id === Number(addButton.dataset.add));
        openCustomize(product);
    }

    if (favoriteButton) {
        const id = Number(favoriteButton.dataset.favorite);

        if (favorites.includes(id)) {
            favorites = favorites.filter(item => item !== id);
        } else {
            favorites.push(id);
        }

        renderProducts();
    }
});

// ================================
// 5. CUSTOMIZE A PRODUCT
// ================================
const customizeModal = document.getElementById("customize-modal");

function openCustomize(product, cartId = null) {
    selectedProduct = product;
    selectedCartId = cartId;

    document.getElementById("modal-product-name").textContent = "Customize " + product.name;
    document.getElementById("modal-product-description").textContent = product.description;

    // Reset choices whenever the customize window opens.
    document.getElementById("size-select").value = "Regular";
    document.getElementById("milk-select").value = "Regular milk";
    document.getElementById("sweetness-select").value = "Regular sweetness";
    document.getElementById("extra-select").value = "No extra shot";

    if (cartId !== null) {
        const cartProduct = cart.find(item => item.cartId === cartId);
        if (cartProduct) {
            document.getElementById("size-select").value = cartProduct.size;
            document.getElementById("milk-select").value = cartProduct.milk;
            document.getElementById("sweetness-select").value = cartProduct.sweetness;
            document.getElementById("extra-select").value = cartProduct.extra;
        }
    }

    customizeModal.hidden = false;
}

function closeCustomize() {
    customizeModal.hidden = true;
    selectedProduct = null;
    selectedCartId = null;
}

document.getElementById("close-modal").addEventListener("click", closeCustomize);

customizeModal.addEventListener("click", event => {
    if (event.target === customizeModal) closeCustomize();
});

document.getElementById("add-customized").addEventListener("click", () => {
    if (!selectedProduct) return;

    const size = document.getElementById("size-select").value;
    const milk = document.getElementById("milk-select").value;
    const sweetness = document.getElementById("sweetness-select").value;
    const extra = document.getElementById("extra-select").value;

    let extraPrice = 0;
    if (size === "Large") extraPrice += 25;
    if (milk === "Oat milk") extraPrice += 20;
    if (milk === "Almond milk") extraPrice += 25;
    if (extra === "Extra espresso shot") extraPrice += 30;

    if (selectedCartId !== null) {
        const item = cart.find(product => product.cartId === selectedCartId);
        if (item) {
            item.size = size;
            item.milk = milk;
            item.sweetness = sweetness;
            item.extra = extra;
            item.extraPrice = extraPrice;
        }
    } else {
        cart.push({
            cartId: nextCartId++,
            productId: selectedProduct.id,
            name: selectedProduct.name,
            image: selectedProduct.image,
            basePrice: selectedProduct.price,
            quantity: 1,
            size,
            milk,
            sweetness,
            extra,
            extraPrice
        });
    }

    closeCustomize();
    renderCart();
});

// ================================
// 6. SHOPPING CART AND QUANTITIES
// ================================
function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Your order is empty.<br>Choose something delicious!</div>';
    } else {
        cartItems.innerHTML = cart.map(item => {
            const unitPrice = item.basePrice + item.extraPrice;
            return `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div>
                        <div class="cart-item-top">
                            <h3>${item.name}</h3>
                            <span class="cart-item-price">${peso(unitPrice * item.quantity)}</span>
                        </div>
                        <p class="cart-details">${item.size} · ${item.milk} · ${item.sweetness}</p>
                        <p class="cart-details">${item.extra}</p>
                        <div class="cart-controls">
                            <button class="customize-link" data-customize="${item.cartId}">✎ Customize</button>
                            <div class="quantity-control">
                                <button data-minus="${item.cartId}" aria-label="Decrease quantity">−</button>
                                <span>${item.quantity}</span>
                                <button class="plus" data-plus="${item.cartId}" aria-label="Increase quantity">+</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join("");
    }

    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotalAmount = cart.reduce((sum, item) => sum + (item.basePrice + item.extraPrice) * item.quantity, 0);

    // Prices are treated as VAT-inclusive, so VAT is calculated as 12/112 of subtotal.
    const vatAmount = subtotalAmount * 12 / 112;

    document.getElementById("cart-count").textContent = itemCount;
    document.getElementById("subtotal-items").textContent = itemCount;
    document.getElementById("subtotal").textContent = peso(subtotalAmount);
    document.getElementById("vat").textContent = peso(vatAmount);
    document.getElementById("total").textContent = peso(subtotalAmount);
    document.getElementById("payment-total").textContent = peso(subtotalAmount);
}

cartItems.addEventListener("click", event => {
    const plus = event.target.closest("[data-plus]");
    const minus = event.target.closest("[data-minus]");
    const customize = event.target.closest("[data-customize]");

    if (plus) {
        const item = cart.find(product => product.cartId === Number(plus.dataset.plus));
        if (item) item.quantity++;
    }

    if (minus) {
        const id = Number(minus.dataset.minus);
        const item = cart.find(product => product.cartId === id);
        if (item) {
            item.quantity--;
            if (item.quantity <= 0) {
                cart = cart.filter(product => product.cartId !== id);
            }
        }
    }

    if (customize) {
        const item = cart.find(product => product.cartId === Number(customize.dataset.customize));
        const product = products.find(product => product.id === item.productId);
        if (item && product) openCustomize(product, item.cartId);
        return;
    }

    renderCart();
});

document.getElementById("clear-cart").addEventListener("click", () => {
    cart = [];
    renderCart();
});

// ================================
// 7. TAKE AWAY OR DINE IN
// ================================
document.querySelectorAll(".order-type-button").forEach(button => {
    button.addEventListener("click", () => {
        document.querySelectorAll(".order-type-button").forEach(item => item.classList.remove("active"));
        button.classList.add("active");
    });
});

// Show or hide the optional note field.
document.getElementById("note-button").addEventListener("click", () => {
    const note = document.getElementById("order-note");
    note.hidden = !note.hidden;
    if (!note.hidden) note.focus();
});

// ================================
// 8. CHECKOUT AND PAYMENT
// ================================
const paymentModal = document.getElementById("payment-modal");

document.getElementById("checkout-button").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Your cart is empty. Please add a product first.");
        return;
    }

    document.getElementById("payment-message").textContent = "";
    paymentModal.hidden = false;
});

document.getElementById("close-payment").addEventListener("click", () => {
    paymentModal.hidden = true;
});

paymentModal.addEventListener("click", event => {
    if (event.target === paymentModal) paymentModal.hidden = true;
});

document.getElementById("confirm-order").addEventListener("click", () => {
    const method = document.getElementById("payment-method").value;
    const orderType = document.querySelector(".order-type-button.active").dataset.type;
    const note = document.getElementById("order-note").value.trim();

    document.getElementById("payment-message").textContent =
        `Demo order confirmed! ${orderType} · ${method}. Your order is ready to be processed.`;

    // This is a front-end demonstration only. No real payment is collected.
    console.log("Order details:", {
        orderType,
        paymentMethod: method,
        note,
        items: cart
    });
});

// ================================
// 9. START THE PAGE
// ================================
renderProducts();
renderCart();