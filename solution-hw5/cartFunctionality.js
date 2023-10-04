import { rolls } from "./rollsData.js"; 

const cart = [];

const glazingPriceAdaptations = {
    "Original": 0.00,
    "Sugar Milk": 0.00,
    "Vanilla Milk": 0.50,
    "Double Chocolate": 1.50
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
        this.glazing =  rollGlazing;
        this.size = packSize;
        this.basePrice = rollPrice;
    }
};


function calculateItemPrice(basePrice, packSize, rollGlazing) { //calculate price based on user Glazing and Pack Size selection
    const glazingPrice = glazingPriceAdaptations[rollGlazing];
    const packMultiplier = packPriceAdaptation[packSize];
    
    const totalPrice = ((basePrice + glazingPrice) * packMultiplier).toFixed(2);

    return totalPrice;
};

function appendCardItem(roll) {
    const template = document.querySelector("#cart-item-template");

    const clone = template.content.cloneNode(true);

    clone.querySelector(".product-card-image img").src = `products/${roll.type.toLowerCase()}-cinnamon-roll.jpg`;
    //productImage.src = `products/${rollType.toLowerCase()}-cinnamon-roll.jpg`
    //console.log( `products/${roll.type.toLowerCase()}-cinnamon-roll.jpg` );
    clone.querySelector(".item-description-flavor").textContent = roll.type + " Cinnamon Roll";
    clone.querySelector(".item-description-glazing").textContent = `Glazing: ${roll.glazing}`;
    clone.querySelector(".item-description-pack-size").textContent = `Pack Size: ${roll.size}`;
    clone.querySelector(".product-card-price p").textContent = `$ ${roll.rollPrice}`;

    const removeButton = clone.querySelector(".remove-button");
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", () => {removeCartItem(roll);
    });

    const cartContainer = document.querySelector(".cart-items");
    cartContainer.appendChild(clone);
}

function updatePriceTotal() { //update total price at bottom of the page after adding or removing item
    const cartTotalPriceElement = document.querySelector(".cart-total-price");
    let totalPrice = 0;

    for (const roll of cart) {
        totalPrice += parseFloat(roll.rollPrice);
    }

    cartTotalPriceElement.textContent = `$ ${totalPrice.toFixed(2)}`;
}

function newRoll(rollType, rollGlazing, packSize) { //create new roll with type, glazing option, and pack size and add new roll to cart
    const rollInfo = rolls[rollType];
    const basePrice = rollInfo.basePrice;

    const roll = new Roll(rollType, rollGlazing, packSize, basePrice);
    roll.rollPrice = calculateItemPrice(roll.basePrice, roll.size, roll.glazing);
    cart.push(roll);
    
    appendCardItem(roll);
    updatePriceTotal()
};



function removeCartItem(roll) { //remove product-card-cart from cart and update price
    const cartIndex = cart.indexOf(roll);
    if (cartIndex !== -1) {
        cart.splice(cartIndex, 1);

        const cartItemsContainer = document.querySelector(".cart-items");
        const cartItemElements = cartItemsContainer.querySelectorAll(".product-card-cart");
        const cartItemToRemove = cartItemElements[cartIndex];
        cartItemsContainer.removeChild(cartItemToRemove);

        updatePriceTotal();
    }
}


newRoll("Original", "Sugar Milk", 1);
newRoll("Walnut", "Vanilla Milk", 12);
newRoll("Raisin", "Sugar Milk", 3);
newRoll("Apple", "Original", 3);

const removeButton = document.querySelector(".remove-button");
removeButton.addEventListener("click", () => {removeCartItem();
});

console.log(cart);
