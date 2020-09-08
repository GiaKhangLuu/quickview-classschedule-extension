window.addEventListener('DOMContentLoaded', evt => {
    const username = window.localStorage.getItem('username');
    const id = window.localStorage.getItem('userid');
    document.getElementById('username').value = username;
    document.getElementById('userid').value = id;
});