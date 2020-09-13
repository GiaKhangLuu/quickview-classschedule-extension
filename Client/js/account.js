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
    alert('Vui lòng chờ trong giây lát');
    console.log('Running...');
    const data = await GetData();
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
    document.getElementsByName('username')[0].disabled = false;
    document.getElementsByName('password')[0].disabled = false;
    document.getElementById('username').innerText = "";
    document.getElementById('userid').innerText = "";
}

const LoginState = data => {
    LoadUser(data);
    document.getElementsByName('username')[0].value = "";
    document.getElementsByName('password')[0].value = "";
    document.getElementsByName('username')[0].disabled = true;
    document.getElementsByName('password')[0].disabled = true;
    document.getElementById('btnLogin').disabled = true;
    document.getElementById('btnLogout').disabled = false;
}

const LoadUser = data => {
    const user = data.user;
    document.getElementById('username').innerText = user.name;
    document.getElementById('userid').innerText = user.id;
}