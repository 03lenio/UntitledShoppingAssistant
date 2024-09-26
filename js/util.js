export async function getProduct() {
    let result = await chrome.storage.local.get(["product"]);
    console.log(result.product);  // This will print the string stored in 'product'
    return result.product;
}

export async function getDescription() {
    let result = await chrome.storage.local.get(["description"]);
    console.log(result.description);  // This will print the string stored in 'product'
    return result.description;
}


export async function isSearching() {
    let result = await chrome.storage.local.get(["searching"]);  // This will print the string stored in 'product'
    return result.searching;
}