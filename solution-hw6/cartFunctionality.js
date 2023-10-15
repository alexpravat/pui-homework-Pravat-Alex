let cart = [];

function loadCart() {
  const storedCart = localStorage.getItem("cart");
  if (storedCart) {
    cart = JSON.parse(storedCart);
    console.log("Cart loaded from local storage:", cart);
  } else {
    cart = [];
    console.log("No cart found in local storage. Created an empty cart.");
  }
}

const glazingPriceAdaptations = {
  "Original": 0.00,
  "Sugar Milk": 0.00,
  "Vanilla Milk": 0.50,
  "Double Chocolate": 1.50,
};

const packPriceAdaptation = {
  1: 1,
  3: 3,
  6: 5,
  12: 10,
};

function calculateItemPrice(basePrice, packSize, rollGlazing) {
  const glazingPrice = glazingPriceAdaptations[rollGlazing];
  const packMultiplier = packPriceAdaptation[packSize];
  const rollPrice = ((basePrice + glazingPrice) * packMultiplier).toFixed(2);
  return rollPrice;
};

function appendCardItem(roll) {
  const template = document.querySelector("#cart-item-template");
  const clone = template.content.cloneNode(true);

  clone.querySelector(".product-card-image img").src = `products/${roll.type.toLowerCase()}-cinnamon-roll.jpg`;
  clone.querySelector(".item-description-flavor").textContent = roll.type + " Cinnamon Roll";
  clone.querySelector(".item-description-glazing").textContent = `Glazing: ${roll.glazing}`;
  clone.querySelector(".item-description-pack-size").textContent = `Pack Size: ${roll.size}`;
  clone.querySelector(".product-card-price p").textContent = `$ ${roll.rollPrice}`;

  const removeButton = clone.querySelector(".remove-button");
  removeButton.textContent = "Remove";
  removeButton.addEventListener("click", () => {
    removeCartItem(roll);
  });

  const cartItemsContainer = document.querySelector(".cart-items");
  cartItemsContainer.appendChild(clone);
};

function updatePriceTotal() {
  const cartTotalPriceElement = document.querySelector(".cart-total-price");
  let totalPrice = 0;

  for (const roll of cart) {
    totalPrice += parseFloat(roll.rollPrice);
  }

  cartTotalPriceElement.textContent = `$ ${totalPrice.toFixed(2)}`;
};

function removeCartItem(roll) {
  const cartIndex = cart.indexOf(roll);
  if (cartIndex !== -1) {
    cart.splice(cartIndex, 1);

    // Save the updated cart to local storage and print
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("Cart updated and saved to local storage:", cart);

    const cartItemsContainer = document.querySelector(".cart-items");
    const cartItemElements = cartItemsContainer.querySelectorAll(".product-card-cart");
    const cartItemToRemove = cartItemElements[cartIndex];
    cartItemsContainer.removeChild(cartItemToRemove);

    updatePriceTotal();
  }
};

function populateCartItems() {
  const cartItemsContainer = document.querySelector(".cart-items");

  // Clear the cart items container to start fresh.
  cartItemsContainer.innerHTML = '';

  for (const roll of cart) {
    appendCardItem(roll);
    updatePriceTotal();
  }
};

window.addEventListener("load", () => {
  loadCart();
  populateCartItems();
});