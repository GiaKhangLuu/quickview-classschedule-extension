window.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(null, data => {
        if(CheckEmptyObj(data)) {
            return;
        }
        const username = document.getElementById('username');
        const userid = document.getElementById('userid');
        const user = data.user;
        username.innerText = user.name;
        userid.innerText = user.id;
    })
});

document.getElementById('btnSignOut').onclick = () => {
    chrome.storage.local.clear(() => { 
        console.log('Cleared storage');
        alert('Đăng xuất thành công');
    });
}

const CheckEmptyObj = obj => {
    return Object.keys(obj).length === 0;
}