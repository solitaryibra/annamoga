function selectProduct(product) {

    const smallModels = document.getElementById("small-models");
    const largeModels = document.getElementById("large-models");
    const description = document.getElementById("model-description");
    const modelSelection = document.getElementById("model-selection");

    if (product === "small") {

        smallModels.style.display = "grid";
        largeModels.style.display = "none";

        description.textContent =
            "Choose one of five stock designs or create a personalized Small Assistant using your face.";

    }

    if (product === "large") {

        smallModels.style.display = "none";
        largeModels.style.display = "grid";

        description.textContent =
            "Choose one of three stock designs or create a personalized Large Face using your face.";

    }

    modelSelection.scrollIntoView({
        behavior: "smooth"
    });
}


function selectModel(model) {

    const result = document.getElementById("selection-result");
    const productText = document.getElementById("selected-product");
    const modelText = document.getElementById("selected-model");

    let productName = "";
    let modelName = "";

    if (model.startsWith("small")) {
        productName = "Small Assistant";
    }

    if (model.startsWith("large")) {
        productName = "Large Face";
    }

    if (model.endsWith("custom")) {
        modelName = "Custom Model — Your Face";
    } else {
        const number = model.split("-")[1];
        modelName = "Stock Model " + number;
    }

    productText.textContent = productName;
    modelText.textContent = modelName;

    result.style.display = "block";

    result.scrollIntoView({
        behavior: "smooth"
    });
}
