chrome.runtime.onInstalled.addListener(() => {    
    chrome.storage.local.clear();
});

chrome.storage.onChanged.addListener(data => {
    console.log('Storage change');
});

