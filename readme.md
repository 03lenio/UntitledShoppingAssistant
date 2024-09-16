# UntitledShoppingAssistant

**UntitledShoppingAssistant** is a Chrome extension that enhances your online shopping experience by allowing you to specify desired product attributes such as size, color, or other specific features. The extension scans websites you visit and uses AI to check if the products listed match your specifications, giving you quick feedback.

## Features
- **AI-Powered Shopping Assistant**: Automatically scans websites you visit for products that match your requirements.
- **Customizable Search Criteria**: Define specific attributes like size, color, material, etc., and compare them against available products on e-commerce websites.
- **Real-Time Comparison**: The extension evaluates each product in real-time as you browse, ensuring the perfect match for your needs.

## How It Works
1. You describe the product you're searching for and the specific features you need (e.g., color: blue, size: medium).
2. As you browse shopping websites, the extension checks if the product you're looking for is mentioned.
3. Using AI, it compares the website’s product description with your specified requirements.
4. You'll receive an immediate indication if the product meets your needs.

## Setup Instructions

### Step 1: Install the Extension
1. Clone or download the extension source code from the repository.
2. In Chrome, navigate to `chrome://extensions/`.
3. Enable **Developer Mode** (toggle switch in the top right).
4. Click on **Load unpacked** and select the folder where you downloaded the extension.

### Step 2: Configure API Authentication
To utilize Azure’s OpenAI API for product comparison, you will need to set up a `config.json` file that handles your API key and endpoint.

#### Creating the `config.json` File
1. In the root folder of the extension, create a new file called `config.json`.
2. Add the following content to the file, replacing the example values with your actual Azure OpenAI API details:

    ```json
    {
        "apiEndpoint": "https://your-api-endpoint.openai.azure.com/openai/deployments/your-deployment-id/chat/completions?api-version=2024-02-15-preview",
        "apiKey": "your-azure-api-key"
    }
    ```
3. Save the config.json file.

### Step 3: Usage
1. After installing and configuring the extension, click on the UntitledShoppingAssistant icon in your Chrome toolbar.
2. Enter the details of the product you're looking for (e.g., "Blue dress, Size M").
3. Start browsing your favorite e-commerce websites.
4. The extension will notify you when it finds a matching product!

## Requirements
- Chromium based browser (latest version)
- Azure OpenAI API access (with correct API key and endpoint)
- Basic familiarity with Chrome extensions
## Contributions
 Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## License
 This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/)