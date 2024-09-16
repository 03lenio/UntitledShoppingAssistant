// fuck chrome for not supporting modules in this context, why do I even have a util.js?
async function getProduct() {
    let result = await chrome.storage.local.get(["product"]);
    console.log(result.product);  
    return result.product;
}

async function isSearching() {
    let result = await chrome.storage.local.get(["searching"]);  
    return result.searching;
}

// API calls cost money so we only want to analyze sites that at least mention the desired product in their webtext
async function check_site_eligble() {
    let searchText = await getProduct();
    let searching = await isSearching();

    if(searching) {
        // Check if the text exists on the webpage
        if (document.body.innerText.includes(searchText)) {
        console.log(`The text "${searchText}" was found on this page.`);
        try {
            // We send a message to the background worker, asking it to please analyze the site
            //TODO// Include the webpage text into the prompt as well as the description of the users desired item
            let prompt = "Tell me a joke"
            const response = await chrome.runtime.sendMessage({ action: "analyzeSite", prompt });
            console.log(response);
        } catch (error) {
            console.log(error.message)
            //TODO// I guess inform the user that something failed?
        }
        } else {
        console.log(`The text "${searchText}" was NOT found on this page.`);
        }
    }
}

check_site_eligble();