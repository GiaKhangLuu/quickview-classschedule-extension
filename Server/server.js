const express = require('express');
const bodyParser = require('body-parser');

const puppeteer = require('./process');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('Client'));
//set time out for server
app.use(function(req, resp, next) {
    resp.setTimeout(120000, function() {
        console.log('Request has timed out');
        res.send(408);
    })
    next();

});

app.get('/', (req, resp) => { resp.redirect('/main') });

app.get('/main', (req, resp) => { 
    resp.sendFile('main.html', { root: 'Client/src/' });
});

app.get('/account', (req, resp) => {
    resp.sendFile('account.html', { root: 'Client/src' });
})

const CheckLogin = async (req, resp, next) => {
    console.log(req.body);
    const username = req.body.username;
    const password = req.body.password;
    const rs = await puppeteer.Login(username, password);
    //errMsg !== nulll => login failed
    if(!rs) {
        console.log('LOGIN FAILED !!!');
        resp.status(200).send(null); 
        return;
    }
    console.log('LOGIN SUCCESSFULLY !!!');
    next();
}

const GetData = async (req, resp) => {
    const data = await puppeteer.GetData();
    const user = data.user;
    const subjects = data.subjects;
    console.log(user);
    console.log(subjects);
    resp.status(200).json(data);
}

app.post('/login', CheckLogin, GetData);

app.listen(PORT, () => { console.log('Server start on port ' + PORT) } );