document.addEventListener('DOMContentLoaded', function () {
    chrome.runtime.sendMessage({ action: 'popupLoaded' }, (response) => {
        if (response && response.responseText) {
        document.getElementById('responseText').textContent = response.responseText;
        } else {
        document.getElementById('responseText').textContent = 'No response received.';
        }
  });
});