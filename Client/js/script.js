const btnLogin = document.getElementById('btnLogin');

btnLogin.onclick = () => {
    chrome.tabs.create({});
}
