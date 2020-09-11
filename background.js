chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.clear();
    //alert('Extension is running');
    const areaName = "local";
    chrome.storage.onChanged.addListener((data, areaName) => {
        console.log('Storage change');
        if(data.subjects.newValue !== undefined) {
            chrome.browserAction.setPopup({ popup: 'Client/src/user.html' });
        } else {
            chrome.browserAction.setPopup({ popup: 'Client/src/login.html' });
        }
    })
})