document.getElementById('btnLogin').onclick = async function() {
    alert('Vui lòng chờ trong giây lát');
    console.log('Running...');
    const data = await GetData();
    if(data !== null) {
        console.log("Get data successfully!!!");
        console.log(data);
        chrome.storage.local.set(data, () => console.log('Set storage successfully'));
        alert('Đăng nhập thất bại');
    } else {
        console.log('Login failed');
        alert('Lỗi đăng nhập');
    }
};

const GetData = async () => {
    //const url = "https://quickview-classschedule.herokuapp.com/login";
    const url = "http://localhost:3000/login";
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
        return null;
    }
}