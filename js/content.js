// fuck chrome for not supporting modules in this context, why do I even have a util.js?
async function getProduct() {
    let result = await chrome.storage.local.get(["product"]);
    console.log(result.product);  
    return result.product;
}

async function getDescription() {
    let result = await chrome.storage.local.get(["description"]);
    console.log(result.description);  
    return result.description;
}

async function isSearching() {
    let result = await chrome.storage.local.get(["searching"]);  
    return result.searching;
}

// API calls cost money so we only want to analyze sites that at least mention the desired product in their webtext
async function check_site_eligble() {
    let searchText = await getProduct();
    let descriptionText = await getDescription();
    let searching = await isSearching();

    if(searching) {
        // Check if the text exists on the webpage
        if (document.body.innerText.toLowerCase().includes(searchText.toLowerCase())) {
        console.log(`The text "${searchText}" was found on this page.`);
        try {
            // We send a message to the background worker, asking it to please analyze the site
            //TODO// Include the webpage text into the prompt as well as the description of the users desired item
            let prompt = `Please analyze the following webpage text against this description of the product the user is looking for "${descriptionText}" webpage_text: "${document.body.innerText}"`
            console.log(prompt);
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