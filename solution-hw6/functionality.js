import { rolls } from "./rollsData.js";

const queryString = window.location.search;
const params = new URLSearchParams(queryString);
const rollType = params.get('roll');
const rollInfo = rolls[rollType];
const basePrice = rollInfo.basePrice;

const glazingPriceAdaptations = {
  "Keep original": 0.00,
  "Sugar milk": 0.00,
  "Vanilla milk": 0.50,
  "Double chocolate": 1.50
};

const packPriceAdaptation = {
  1: 1,
  3: 3,
  6: 5,
  12: 10,
};

class Roll {
    constructor(rollType, rollGlazing, packSize, rollPrice) {
      this.type = rollType;
      this.glazing = rollGlazing;
      this.size = packSize;
      this.rollPrice = parseFloat(rollPrice);
    }
};

let packSize = 1;
const glazingDropdown = document.getElementById("glazingTypes");
const packSizeDropdown = document.getElementById("packSize");
const ProductDetailPrice = document.getElementById("ProductDetailPrice");

function populateDropdownOptions() {
  for (const glazingOption in glazingPriceAdaptations) {
    const option = document.createElement("option");
    option.value = glazingOption;
    option.textContent = glazingOption;
    glazingDropdown.appendChild(option);
  }

  for (packSize in packPriceAdaptation) {
    const option = document.createElement("option");
    option.value = packSize;
    option.textContent = packSize;
    packSizeDropdown.appendChild(option);
  }
};

populateDropdownOptions();

function updateTotalPrice() {
  let glazingOption = document.getElementById("glazingTypes").value;
  let packSizeOption = document.getElementById("packSize").value;

  const glazingPrice = glazingPriceAdaptations[glazingOption];
  const packMultiplier = packPriceAdaptation[packSizeOption];

  const totalPrice = ((basePrice + glazingPrice) * packMultiplier);
  ProductDetailPrice.textContent = "$" + totalPrice.toFixed(2);
};

updateTotalPrice();

document.getElementById("glazingTypes").addEventListener("change", updateTotalPrice);
document.getElementById("packSize").addEventListener("change", updateTotalPrice);

document.querySelector('.page-heading h1').textContent = `${rollType} Cinnamon Roll`;

const productImage = document.querySelector('.product-card-detail-image img');
productImage.src = `products/${rollType.toLowerCase()}-cinnamon-roll.jpg`;

let cart = [];

function calculateItemPrice(basePrice, packSize, rollGlazing) {
  const glazingPrice = glazingPriceAdaptations[rollGlazing];
  const packMultiplier = packPriceAdaptation[packSize];
  const rollPrice = ((basePrice + glazingPrice) * packMultiplier).toFixed(2);
  return rollPrice;
};

function addToCart() {
  const glazingOption = glazingDropdown.value;
  const packSizeOption = packSizeDropdown.value;

  const rollInfo = rolls[rollType];
  const basePrice = rollInfo.basePrice;
  const rollPrice = calculateItemPrice(basePrice, packSizeOption, glazingOption);

  const roll = new Roll(rollType, glazingOption, packSizeOption, rollPrice);

  cart.push(roll);

  localStorage.setItem("cart", JSON.stringify(cart));
  console.log("Cart updated and saved to local storage:", cart);
};

function initializeCart() {
  const storedCart = localStorage.getItem("cart");
  if (storedCart) {
    cart = JSON.parse(storedCart);
    console.log("Cart loaded from local storage:", cart);
  } else {
    cart = [];
    console.log("No cart found in local storage. Created an empty cart.");
  }
};

window.addEventListener("load", () => {
  initializeCart();
});

const addToCartButton = document.querySelector(".add-to-cart-button");
addToCartButton.addEventListener("click", addToCart);
