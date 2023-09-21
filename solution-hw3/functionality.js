const glazingPriceAdaptations = {
    "Keep original": 0.00,
    "Sugar milk": 0.00,
    "Vanilla milk": 0.50,
    "Double chocolate": 1.50
};

const packSizes = [1, 3, 6, 12];

function populateDropdownOptions() { //function to populate labels with drop down options
    const glazingDropdown = document.getElementById("glazingTypes");
    const packSizeDropdown = document.getElementById("packSize");

    for (const glazingOption in glazingPriceAdaptations) {
        const option = document.createElement("option");
        option.value = glazingOption;
        option.textContent = glazingOption;
        glazingDropdown.appendChild(option);
    }

    packSizes.forEach((size) => {
        const option = document.createElement("option");
        option.value = size;
        option.textContent = size;
        packSizeDropdown.appendChild(option);
    });
}

populateDropdownOptions();

function updateTotalPrice() { //function to update price based on user selection
    const ProductDetailPrice = document.getElementById("ProductDetailPrice");
    let glazingOption = document.getElementById("glazingTypes").value;
    let packSizeOption = document.getElementById("packSize").value;

    const glazingPrice = glazingPriceAdaptations[glazingOption];

    const totalPrice = ((2.49 + glazingPrice) * packSizeOption);
    ProductDetailPrice.textContent = "$"+ totalPrice.toFixed(2);
    //console.log(totalPrice) 
}

updateTotalPrice();

document.getElementById("glazingTypes").addEventListener("change", updateTotalPrice);
document.getElementById("packSize").addEventListener("change", updateTotalPrice);

