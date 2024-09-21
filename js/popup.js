import { getProduct, isSearching } from './util.js';

// UI and Storage handling of the analysis mode
async function toggleAnalysis() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    let isSearchingValue = await isSearching();
    if (isSearchingValue) {
        // We are already in analysis mode, so we disable it
        analyzeBtn.classList.remove("analyzing");
        analyzeBtn.textContent = "Enable analysis";
        chrome.storage.local.set({ searching: false });
    } else {
        // Enable analysis mode if we got a product
        const searchText = document.getElementById('product').value;
        const descriptionText = document.getElementById('description').value;
        if (searchText) {
            if (descriptionText) {
            analyzeBtn.classList.add("analyzing");
            analyzeBtn.textContent = "Disable analysis";
            chrome.storage.local.set({ searching: true });
            chrome.storage.local.set({ product: searchText });
            chrome.storage.local.set({ description: descriptionText});
            } else {
                alert("Please specify a rough description of the product you are looking for!");
            }
        } else {
            alert("Please specify a product!");
        }
    }
}

// Restore the UI of the button upon opening the popup.html
async function restoreBtnState() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    
    let result = await chrome.storage.local.get(["searching"]);
    
    if (result.searching) {
        // Restore the searching state
        analyzeBtn.classList.add("analyzing");
        analyzeBtn.textContent = "Disable analysis";
        getProduct();
    } else {
        // Handle case where 'searching' is false or undefined
        analyzeBtn.classList.remove("analyzing");
        analyzeBtn.textContent = "Enable analysis";
    }
}


document.addEventListener('DOMContentLoaded', function () {
    // Load saved values for all input fields and text areas
    chrome.storage.local.get(null, function(items) {
        const inputs = document.querySelectorAll('.inputField');
        inputs.forEach(input => {
        const key = input.id || input.placeholder;
        if (items[key]) {
            input.value = items[key];
        }
        });
    });
    // Save input values as the user types
    const inputs = document.querySelectorAll('.inputField');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
        const key = this.id || this.placeholder;
        chrome.storage.local.set({[key]: this.value}, function() {
            console.log(`Value for ${key} is set to ${this.value}`);
        }.bind(this));
        });
    });

    // Should not need an explanation
    const analyzeBtn = document.getElementById('analyzeBtn');
    restoreBtnState();

    analyzeBtn.addEventListener('click', function () {
            toggleAnalysis();
    });
});

