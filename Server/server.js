const express = require('express');
const bodyParser = require('body-parser');

const puppeteer = require('./process');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('Client'));

app.get('/', (req, resp) => { resp.send('Hello') });
app.get('/login', (req, resp) => { 
    resp.sendfile('Client/src/login.html');
    //if(resp.locals.errMsg !== null) {
        //resp.send('<span style="color: red;">' + resp.locals.errMsg + '</span>');
    //}
});

const CheckLogin = async (req, resp, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const errMsg = await puppeteer.CheckLogin(username, password);
    //errMsg !== nulll => login failed
    if(errMsg !== null) {
        console.log('LOGIN FAILED !!!');
        resp.redirect('/login'); 
        return;
    }
    console.log('LOGIN SUCCESSFULLY !!!');
    next();
}

const GetData = async (req, resp) => {
    const data = await puppeteer.GetData();
    const user = data[0];
    const subjects = data[1];
    console.log(user);
    console.log(subjects);
    resp.sendfile('Client/src/test.html');
}

app.post('/login', CheckLogin, GetData);



app.listen(PORT, () => { console.log('Server start on port ' + PORT) } );