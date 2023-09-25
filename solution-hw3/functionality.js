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

function populateDropdownOptions() { //populate Glazing and Pack Size labels with dropdown options
    const glazingDropdown = document.getElementById("glazingTypes");
    const packSizeDropdown = document.getElementById("packSize");

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

    const totalPrice = ((2.49 + glazingPrice) * packMultiplier);
    ProductDetailPrice.textContent = "$"+ totalPrice.toFixed(2);
    //console.log(totalPrice) 
}

updateTotalPrice();

document.getElementById("glazingTypes").addEventListener("change", updateTotalPrice);
document.getElementById("packSize").addEventListener("change", updateTotalPrice);

