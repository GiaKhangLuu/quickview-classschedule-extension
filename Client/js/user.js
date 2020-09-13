window.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(null, data => {
        if(IsEmptyObj(data)) {
            return;
        }
        const username = document.getElementById('username');
        const userid = document.getElementById('userid');
        const user = data.user;
        username.innerText = user.name;
        userid.innerText = user.id;
    })
});

document.getElementById('btnLogout').onclick = () => {
    chrome.storage.local.clear(() => { 
        console.log('Cleared storage');
        alert('Đăng xuất thành công');
    });
}

const IsEmptyObj = obj => {
    return Object.keys(obj).length === 0;
}