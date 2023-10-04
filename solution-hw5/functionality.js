import { rolls } from "./rollsData.js";

const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const rollType = params.get('roll');
    const rollInfo =rolls[rollType];
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
}

let packSize = 1;
const glazingDropdown = document.getElementById("glazingTypes");
const packSizeDropdown = document.getElementById("packSize");

function populateDropdownOptions() { //populate Glazing and Pack Size labels with dropdown options
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
}

populateDropdownOptions();

function updateTotalPrice() { //update price based on user Glazing and Pack Size selection
    const ProductDetailPrice = document.getElementById("ProductDetailPrice");
    let glazingOption = document.getElementById("glazingTypes").value;
    let packSizeOption = document.getElementById("packSize").value;

    const glazingPrice = glazingPriceAdaptations[glazingOption];
    const packMultiplier = packPriceAdaptation[packSizeOption];
    
    const totalPrice = ((basePrice + glazingPrice) * packMultiplier);
    ProductDetailPrice.textContent = "$"+ totalPrice.toFixed(2);
}

updateTotalPrice(); 

document.getElementById("glazingTypes").addEventListener("change", updateTotalPrice);
document.getElementById("packSize").addEventListener("change", updateTotalPrice);

document.querySelector('.page-heading h1').textContent = `${rollType} Cinnamon Roll`;

const productImage = document.querySelector('.product-card-detail-image img');
productImage.src = `products/${rollType.toLowerCase()}-cinnamon-roll.jpg`;

const cart = [];

function addToCart(){ //add user input to cart[] array and print roll info in foncolse
    const glazingOption = glazingDropdown.value;
    const packSizeOption = packSizeDropdown.value;

    const rollInfo = rolls[rollType];
    
    const roll = new Roll(rollType, glazingOption, packSizeOption, basePrice);

    cart.push(roll);

    console.log("Cart: ", cart);
}

class Roll {
    constructor(rollType, rollGlazing, packSize, basePrice) {
        this.type = rollType;
        this.glazing =  rollGlazing;
        this.size = packSize;
        this.basePrice = basePrice;
    }
}

const addToCartButton = document.querySelector(".add-to-cart-button");
addToCartButton.addEventListener("click", addToCart);


