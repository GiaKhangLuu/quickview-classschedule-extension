document.getElementById('btnLogin').onclick = async function() {
    console.log('Running...');
    const data = await GetData();
    console.log(data);
}

const GetData = async () => {
    const url = "https://quickview-classschedule.herokuapp.com/login";
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
        throw new Error("Request failed!");
    } catch(error) {
        console.log(error.message);
    }
}