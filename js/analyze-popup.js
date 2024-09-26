const analyzeBtn = document.getElementById('analyzeBtn');
analyzeBtn.addEventListener('click', async function () {
  try {
    // We send a message to the background worker, asking it to create the popup which confirms if the site should be analyzed
    //TODO// Include the webpage text into the prompt as well as the description of the users desired item
    const params = new URLSearchParams(window.location.search);
    const prompt = params.get('prompt');
    const response = await chrome.runtime.sendMessage({ action: "analyzeSite", prompt: prompt });
    console.log(response);
    window.close();
    } catch (error) {
        console.log(error.message)
        //TODO// I guess inform the user that something failed?
  }
});

const closeBtn = document.getElementById('closeBtn');
closeBtn.addEventListener('click',  function () {
  window.close();
});
