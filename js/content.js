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

function isUrlValid(url, urlsToIgnore) {
    return !urlsToIgnore.some(urlToIgnore => 
        url.toLowerCase().includes(urlToIgnore.toLowerCase())
    );
}

function doesSiteContainTerms(webText, terms) {
    return terms.some(term => 
        webText.toLowerCase().includes(term.toLowerCase())
    );
}

// API calls cost money so we only want to analyze sites that at least mention the desired product in their webtext
async function checkSiteEligble() {
    let searchText = await getProduct();
    let descriptionText = await getDescription();
    let searching = await isSearching();
    urlsToIgnore = ["bing.com", "google.com", "yandex", "duckduckgo", "brave.com"]
    searchTerms = searchText.split(" ");
    if(searching && isUrlValid(document.URL, urlsToIgnore) && doesSiteContainTerms(document.body.innerText, searchTerms)) {
        // Check if the text exists on the webpage
        // We check if there is an indicator of a checkout or add to cart option, this filters out sites that only compare prices
        if (document.body.innerHTML.toLowerCase().includes("cart") || document.body.innerHTML.toLowerCase().includes("checkout")) {
            try {
                // We send a message to the background worker, asking it to create the popup which confirms if the site should be analyzed
                let prompt = `Please analyze the following webpage text against this description of the product the user is looking for "${descriptionText}" webpage_text: "${document.body.innerText}"`
                const response = await chrome.runtime.sendMessage({ action: "showAnalyzePopup", prompt: prompt });
                console.log(response);
            } catch (error) {
                console.log(error.message)
                //TODO// I guess inform the user that something failed?
            }
        }
        } else {
        console.log(`The product "${searchText}" is likely not to be found on this site.`);
    }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getPageText") {
      sendResponse({ webText: document.body.innerText });
    }
  });           
checkSiteEligble();