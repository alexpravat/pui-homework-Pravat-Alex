import { rolls } from "./rollsData.js";

const productCards = document.querySelectorAll(".product-card");

for (let i = 0; i < productCards.length; i++) {
    let card = productCards[i];
    let rollType = card.id;
    let productDetailLink = card.querySelector("a");

    productDetailLink.href = `./ProductDetail.html?roll=${rollType}`;

    const productName = card.querySelector(".product-name");
    const productPrice = card.querySelector(".product-price");

    productName.textContent = `${rollType} cinnamon roll`;
    productPrice.textContent = `$${rolls[rollType].basePrice.toFixed(2)}`;
};
