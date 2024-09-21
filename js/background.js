console.log("Background script loaded");

// Since Azure has pretty harsh token limits we often need to cutoff the length of the prompt to comply with their rate limits
function cutoffPrompt(text, amount) {
  // Split the text into words based on spaces
  const words = text.split(/\s+/);
  // Check if the text has more than 100 words
  if (words.length > amount) {
    // Join the first 100 words and add ellipsis
    return words.slice(0, amount).join(' ') + '...';
  }
  // If the text is less than or equal to 100 words, return it as is
  return text;
}

// Load the config and assign the API endpoint and key to constants
async function loadConfig() {
  try {
    const response = await fetch(chrome.runtime.getURL('config.json'));
    const config = await response.json();
    const apiEndpoint = config.apiEndpoint;
    const apiKey = config.apiKey;

    console.log("API URL:", apiEndpoint);
    console.log("API Key:", apiKey);
    return config;
  } catch (error) {
    console.error('Error loading config:', error);
    return null;
  }
}

const analyzeSite = async (apiEndpoint, apiKey, prompt) => {
  // Azure API auth stuff
  const payload = {
    "messages": [
      {
        "role": "system",
        "content": [
          {
            "type": "text",
            "text": cutoffPrompt(prompt, 100)
          }
        ]
      }
    ],
    "temperature": 0.7,
    "top_p": 0.95,
    "max_tokens": 100
  }

  // Make the request
  try {
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    console.log("API Response:", result);
    // If the AI had a result, return it
    if (result.choices && result.choices.length > 0) {
      const aiResponse = result.choices[0].message.content.trim();
      console.log(aiResponse);
      return aiResponse;
    } else {
      return "No response from AI";
    }
  } catch (error) {
    console.error("Error:", error);
    return "Error: " + error.message;
  }
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "analyzeSite") {
    console.log("Received message:", message);
    // Load the API Endpoint and API Key from the config
    loadConfig().then(config =>  {
      // Only continue if the config could be loaded
      if(config) {
        apiEndpoint = config.apiEndpoint;
        apiKey = config.apiKey;
        // Call the async function and handle the result using .then()
        analyzeSite(apiEndpoint, apiKey, message.prompt).then(result => {
           // send the result back once the async function completes
          sendResponse(result);
          lastResponse = result;
          // Create the popup that informs the user about the site
          chrome.windows.create({
            url: chrome.runtime.getURL("html/info-popup.html"),
            type: "popup",
            width: 400,
            height: 300
          }, function(newWindow) {
            // Send the response text to the newly created popup window
            chrome.runtime.sendMessage({
              action: "displayResponse",
              responseText: result
            });
          });
        }).catch(error => {
          sendResponse("Error: " + error.message);
        });
      } else {
        sendResponse("Error: Config could not be loaded!");
      }
    });

    return true; // Indicates that the response will be sent asynchronously
  }
  else if(message.action == "popupLoaded") {
    // As soon as the pop up is loaded, send the last API response back to the popup
    sendResponse({ responseText: lastResponse });
  }
});
