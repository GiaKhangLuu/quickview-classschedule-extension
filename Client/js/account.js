import { dictimArr } from './dictim.js';
var showPasswordFlag = false;

document.getElementById('chbShowPass').onclick = () => {
    showPasswordFlag = !showPasswordFlag;
    if(showPasswordFlag === true) {
        document.getElementById('password').type = 'text';
    } else {
        document.getElementById('password').type = 'password';
    }
}

window.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(null, data => {
        if(Object.keys(data).length === 0) {
            AnonymousState();
            return;
        }
        LoginState(data);
    });
});

document.getElementById('btnLogin').onclick = async function() {
    PreLoadingScreen();
    alert('Vui lòng chờ trong giây lát');
    console.log('Running...');
    const data = await GetData();
    PostLoadingScreen();
    if(data !== null) {
        console.log("Get data successfully!!!");
        console.log(data);
        chrome.storage.local.set(data, () => console.log('Set storage successfully'));
        alert('Đăng nhập thành công');
        LoginState(data);
    } else {
        console.log('Login failed');
        alert('Đăng nhập thất bại');
    }
};

document.getElementById('btnLogout').onclick = () => {
    AnonymousState();
    console.log('Cleared storage');
    alert('Đăng xuất thành công');
}


const GetData = async () => {
    const url = "https://quickview-classschedule.herokuapp.com/login";
    //const url = "http://localhost:3000/login";
    const username = document.getElementsByName('username')[0].value;
    const password = document.getElementsByName('password')[0].value;
    const data = JSON.stringify({
        username: username,
        password: password
    });
    try {
        const response = await fetch(url, {
            //set mode no-cors to prevent CORS but limit Content-type: application/json (just use when run on web page)   
            //mode: 'no-cors', 
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: data
        });
        if(response.ok) {
            const jsonResponse = await response.json();
            return jsonResponse;
        }
        throw new Error();
    } catch(error) {
        console.log(error);
        return null;
    }
}

const AnonymousState = () => {
    chrome.storage.local.clear();
    document.getElementById('btnLogin').disabled = false;
    document.getElementById('btnLogout').disabled = true;
    document.getElementById('notiAnonymous').style.display = 'block';
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('infoUser').style.display = 'none';
    document.getElementById('dictimContainer').style.display = 'none';
}

const LoginState = data => {
    document.getElementsByName('username')[0].value = "";
    document.getElementsByName('password')[0].value = "";
    document.getElementById('btnLogin').disabled = true;
    document.getElementById('btnLogout').disabled = false;
    document.getElementById('notiAnonymous').style.display = 'none';
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('infoUser').style.display = 'block';
    document.getElementById('dictimContainer').style.display = 'block';
    LoadUser(data);
    GetRandomDictim();
}

const LoadUser = data => {
    const user = data.user;
    document.getElementById('username').innerText = user.name;
    document.getElementById('userid').innerText = user.id;
}

const PreLoadingScreen = () => {
    document.getElementById('preloader').style.display = 'block';
    document.getElementsByTagName('main')[0].style.display = 'none';
}

const PostLoadingScreen = () => {
    document.getElementById('preloader').style.display = 'none';
    document.getElementsByTagName('main')[0].style.display = 'block';
}

const GetRandomDictim = () => {
    const dictim = dictimArr[Math.floor(Math.random() * dictimArr.length)];
    document.getElementById('dictim').innerText = dictim;
}