const puppeteer = require('puppeteer');
var browser = null;
var page = null;

module.exports.Login = async (username, password) => {
    console.log('Run run runnn .....');
    browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: true });
    page = await browser.newPage();
    page.setDefaultNavigationTimeout(30000);
    var resp = null;
    try {
        await page.goto('https://portal.huflit.edu.vn/login', { waituntil: 'domcontentloaded' });
        const txtUser = await page.$("input[name=txtTaiKhoan]");
        const txtPass = await page.$("input[name=txtMatKhau]");
        await page.evaluate((txtUser, txtPass, username, password) => {
            txtUser.value = username;
            txtPass.value = password;
        }, txtUser, txtPass, username, password);
        const btnLogin = await page.$(".loginbox-submit > input");
        resp = await Promise.all([
            page.waitForNavigation(), //the promise resolves after navigation has finished
            btnLogin.click() //click the button will indirectly cause navigation 
        ]);
    } catch(err) {
        console.log(err);
        return false;
    }; 
    if(resp == null || resp[0].url() === 'https://portal.huflit.edu.vn/login') { 
        return false;
    };
    return true;
};

//module.exports.CheckLogin = async (username, password) => {
    //var errMessage = null;
    //await Login(username, password);
    //errMessage = await page.evaluate(() => {
        //const spanErr = document.querySelector('.loginbox-forgot > span');
        ////if spanErr exist (!= null) => login failed => return portal msg
        //if(spanErr !== null) {
            //return spanErr.innerText;
        //}
        //return null;
    //});
    //return errMessage
//}

const GoToScheduleTab = async () => {
    //await this.Login(username, password);
    try {
        await page.goto('https://portal.huflit.edu.vn/Home/Schedules', { waitUntil: 'domcontentloaded' });
        console.log('PAGE SCHEDULE LOADED !!!');
   } catch(err) {
        console.log(err);
        await browser.close();
    }
};

const CrawlData = async () => {
    var data = null;
    await GoToScheduleTab();
    try {
        const btnTKB = (await page.$$("ul.nav.nav-tabs > li > a"))[1];
        await Promise.all([
            page.waitForSelector('#divThoiKhoaBieuTietThu > table > tbody > tr'),
            btnTKB.click()
        ]);
        data = await page.evaluate(CrawlScript);
    } catch(err) {
        console.log(err);
        await browser.close();
    }
    return data;
}

const CrawlScript = () => {
    const student = {};
    const subjectArr = [];
    const infoSubjects = Array.from(
        document.querySelectorAll("#divThoiKhoaBieuTietThu > table > tbody > tr")
    );
    const infoStudent = document.querySelector("a.stylecolor > span").innerText.split(" | ");
    student["id"] = infoStudent[0];
    student["name"] = infoStudent[1];
    infoSubjects.forEach(infoSub => {
        const subject = {};
        const cells = infoSub.children;
        subject["name"] = cells.item(2).innerText;
        subject["day"] = cells.item(5).innerText;
        subject["time"] = cells.item(6).innerText;
        subject["room"] = cells.item(7).innerText;
        subject["lecturer"] = cells.item(8).innerText;
        const datestart_dateend = cells.item(9).innerText;
        //datestart_dateend return "(dd/mm/yyy->dd/mm/yyyy)";
        const temp = datestart_dateend.split("->");
        subject["dateStart"] = temp[0].substring(2); //remove '('
        subject["dateEnd"] = temp[1].substring(0, temp[1].length - 1); //remove ')'
        subjectArr.push(subject);
    });
    if(subjectArr.length > 1) {
        const rs = { name: student, subjects: subjectArr };
        return rs;
    }
    return null;
};

const ConvertClassHourToHour = classHour => {
  switch (classHour) {
    case '1':
      return "6h45 AM";
    case '2':
      return "7h35 AM";
    case '3':
      return "8h25 AM";
    case '4':
      return "9h30 AM";
    case '5':
      return "10h20 AM";
    case '6':
      return "11h10 AM";
    case '7':
      return "12h45 PM";
    case '8':
      return "13h35 PM";
    case '9':
      return "14h25 PM";
    case '10':
      return "15h30 PM";
    case '11':
      return "16h20 PM";
    case '12':
      return "17h10 PM";
    case '13':
      return "18h15 PM";
    case '14':
      return "19h05 PM";
    case '15':
      return "19h55 PM";
  }
};

module.exports.GetData = async (username, password) => {
    const data = await CrawlData();
    if(browser != null && page != null) {
        await page.close();
        await browser.close();
        console.log('BROWSER CLOSED !!!');
    }
    if(data != null) {
        console.log('CRAWL SUCCESSFULLY !!!');
        const subjectArr = data.subjects;
        subjectArr.forEach(subject => {
            subject["time"] = ConvertClassHourToHour(subject["time"]);
        });
        return data;
    }
    return null;
}

