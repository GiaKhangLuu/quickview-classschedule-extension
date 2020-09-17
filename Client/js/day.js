class CustomizedDay {
    constructor(dateString) {
        const dateInfo = dateString.split(' ');
        this.day = this.ConvertDay(dateInfo[0]);
        this.month = this.ConvertMonth(dateInfo[1]);
        this.date = dateInfo[2];
        this.year = dateInfo[3];
    }

    ConvertDay(day) {
        switch(day) {
            case 'Mon' :
                return 'Hai';
            case 'Tue' :
                return 'Ba';
            case 'Wed' :
                return 'Tư';
            case 'Thu' :
                return 'Năm';
            case 'Fri' :
                return 'Sáu';
            case 'Sat' :
                return 'Bảy';
            case 'Sun' :
                return 'Chủ Nhật';
        }
    }

    ConvertMonth(month) {
        switch(month) {
            case 'Jan' :
                return '01';
            case 'Feb' :
                return '02';
            case 'Mar' :
                return '03';
            case 'Apr' :
                return '04';
            case 'May' :
                return '05';
            case 'Jun' :
                return '06';
            case 'Jul' :
                return '07';
            case 'Aug' :
                return '08';
            case 'Sep' :
                return '09';
            case 'Oct' :
                return '10';
            case 'Nov' :
                return '11';
            case 'Dec' :
                return '12';
        };
    }

    ToString() {
        return `${this.date}/${this.month}/${this.year}`;
    }
};

var today = new Date();
var defaultDate = today.getDate();
var defaultMonth = today.getMonth() + 1;
var defaultYear = today.getFullYear();

window.addEventListener('DOMContentLoaded', () => {
    GetTodaySubjs();
});

document.getElementById('btnToday').onclick = () => {
    GetTodaySubjs();
};


document.getElementById('btnNextDay').onclick = () => {
    defaultDate++;
    const dayStr = new Date(defaultYear, defaultMonth - 1, defaultDate).toDateString();
    const cusDate = new CustomizedDay(dayStr);
    GetSubjectByDay(cusDate);
}

document.getElementById('btnPreviousDay').onclick = () => {
    defaultDate--;
    const dayStr = new Date(defaultYear, defaultMonth - 1, defaultDate).toDateString();
    const cusDate = new CustomizedDay(dayStr);
    GetSubjectByDay(cusDate);
}

const GetTodaySubjs = () => {
    defaultDate = today.getDate();
    defaultMonth = today.getMonth() + 1;
    defaultYear = today.getFullYear();
    const dateStr = today.toDateString();
    const cusDate = new CustomizedDay(dateStr);
    GetSubjectByDay(cusDate);
};

const GetSubjectByDay = date => {
    chrome.storage.local.get("subjects", rs => {
        const subjsByDay = []
        if(Object.keys(rs).length === 0) {
            console.log('U r anonymous');
            return;
        }
        const subjectArr = rs.subjects;
        subjectArr.forEach(subject => {
            if(subject.day === date.day && !(IsSubjectOutOfDate(subject, date.ToString()))) {
                subjsByDay.push(subject);
            };
        });
        if(subjsByDay.length === 0) {
            console.log('Hom nay ban kh co mon hoc');
        } else {
            RenderSubjects(subjsByDay);
        }
    });
};

const IsSubjectOutOfDate = (subject, day) => { //input must be dd/mm/yyyy
    const dateStartInfo = subject.dateStart.split('/');
    const dateEndInfo = subject.dateEnd.split('/');
    const dateInfo = day.split('/');
    const dateStart = ConvertDateToInt(dateStartInfo[0], dateStartInfo[1], dateStartInfo[2]);
    const dateEnd = ConvertDateToInt(dateEndInfo[0], dateEndInfo[1], dateEndInfo[2]);
    const date = ConvertDateToInt(dateInfo[0], dateInfo[1], dateInfo[2]);
    if(dateStart <= date && date <= dateEnd) {
        return false;
    }
    return true;
}

const ConvertDateToInt = (date, month, year) => {
    date = parseInt(date);
    month = parseInt(month);
    year = parseInt(year);
    var rs = 0;
    var distance = year - 2020;
    rs += distance * 365;
    //handle leap year
    var leapYears = parseInt(distance / 4) + 1;
    if(date === 29 && month == 2) {
        return rs + 31 + 29 + leapYears - 1;
    }
    if(month <= 2) {
        leapYears -= 1;
    }
    rs += leapYears;
    rs += ConvertMonthToDay(month - 1);
    rs += date;
    return rs;
};

const ConvertMonthToDay = month => {
    switch (month) {
        case 1:
            return 31;
        case 2:
            return 31 + 28;
        case 3:
            return 31 + 28 + 31;
        case 4:
            return 31 + 28 + 31 + 30;
        case 5:
            return 31 + 28 + 31 + 30 + 31;
        case 6:
            return 31 + 28 + 31 + 30 + 31 + 30;
        case 7:
            return 31 + 28 + 31 + 30 + 31 + 30 + 31;
        case 8:
            return 31 + 28 + 31 + 30 + 31 + 30 + 31 + 31;
        case 9:
            return 31 + 28 + 31 + 30 + 31 + 30 + 31 + 31 + 30;
        case 10:
            return 31 + 28 + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31;
        case 11:
            return 31 + 28 + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31 + 30;
    }
};

const HandleIncreaseDate = () => {
    switch(defaultDate && defaultMonth && defaultYear) {
        case defaultMonth === 1 && defaultDay === 32:
            defaultMonth = 2;
            defaultDate = 1;
        case defaultMonth === 2 && defaultDay === 30 && (defaultYear % 4) === 0:
            defaultMonth = 3;
            defaultDate = 1;
        case defaultMonth === 2 && defaultDay === 29 && (defaultYear % 4) !== 0:
            defaultMonth = 3;
            defaultDate = 1;
        case defaultMonth === 3 && defaultDay === 32:
            defaultMonth = 3;
            defaultDate = 1;
        case defaultMonth === 4 && defaultDay === 31:
            defaultMonth = 5;
            defaultDate = 1;
        case defaultMonth === 5 && defaultDay === 32:
            defaultMonth = 6;
            defaultDate = 1;
        case defaultMonth === 6 && defaultDay === 31:
            defaultMonth = 7;
            defaultDate = 1;
        case defaultMonth === 7 && defaultDay === 32:
            defaultMonth = 8;
            defaultDate = 1;
        case defaultMonth === 8 && defaultDay === 32:
            defaultMonth = 9;
            defaultDate = 1;
        case defaultMonth === 9 && defaultDay === 31:
            defaultMonth = 10;
            defaultDate = 1;
        case defaultMonth === 10 && defaultDay === 32:
            defaultMonth = 11;
            defaultDate = 1;
        case defaultMonth === 11 && defaultDay === 31:
            defaultMonth = 12;
            defaultDate = 1;
        case defaultMonth === 12 && defaultDay === 32:
            defaultMonth = 1;
            defaultDate = 1;
            defaultYear++;
    }
};

const HandleDecreaseDate = () => {
    switch(defaultDate, defaultMonth, defaultYear) {
        case defaultMonth === 1 && defaultDay === 0:
            defaultDate = 31;
            defaultMonth = 12;
            defaultYear--;
        case defaultMonth === 2 && defaultDay === 0:
            defaultMonth = 1;
            defaultDate = 31;
        case defaultMonth === 3 && defaultDay === 0 && (defaultYear % 4) !== 0: //nam kh nhuan
            defaultMonth = 2;
            defaultDate = 28;
        case defaultMonth === 3 && defaultDay === 0 && (defaultYear % 4) === 0: //nam nhuan
            defaultMonth = 2;
            defaultDate = 29;
        case defaultMonth === 4 && defaultDay === 0:
            defaultMonth = 3;
            defaultDate = 31;
        case defaultMonth === 5 && defaultDay === 0:
            defaultMonth = 4;
            defaultDate = 30;
        case defaultMonth === 6 && defaultDay === 0:
            defaultMonth = 5;
            defaultDate = 31;
        case defaultMonth === 7 && defaultDay === 0:
            defaultMonth = 6;
            defaultDate = 30;
        case defaultMonth === 8 && defaultDay === 0:
            defaultMonth = 7;
            defaultDate = 31;
        case defaultMonth === 9 && defaultDay === 0:
            defaultMonth = 8;
            defaultDate = 31;
        case defaultMonth === 10 && defaultDay === 0:
            defaultMonth = 9;
            defaultDate = 30;
        case defaultMonth === 11 && defaultDay === 0:
            defaultMonth = 10;
            defaultDate = 31;
        case defaultMonth === 12 && defaultDay === 0:
            defaultMonth = 11;
            defaultDate = 30;
    }
}

const RenderTableHeader = table => {
    const titleArr = ["Thứ", "Tiết", "Môn học", "TG Bắt đầu", "Phòng", "Giảng viên"];
    const header = table.createTHead();
    const row = header.insertRow();
    titleArr.forEach(title => {
        const th = document.createElement("th");
        th.innerText = title;
        row.appendChild(th);
    })
}

const RemoveOldTable = table => {
    const row = table.rows.length;
    for(let i = 0; i < row; i++) {
        table.deleteRow(0);
    }
}

const RenderTableBody = (table, subjArr) => {
    subjArr.forEach(subject => {
        const row = table.insertRow();
        const cellDay = row.insertCell();
        const cellClassHour = row.insertCell();
        const cellSubjName = row.insertCell();
        const cellStartTime = row.insertCell();
        const cellRoom = row.insertCell();
        const cellLecturer = row.insertCell();
        cellDay.innerText = subject.day;
        cellClassHour.innerText = subject.time;
        cellSubjName.innerText = subject.name;
        cellStartTime.innerText = subject.time;
        cellRoom.innerText = subject.room;
        cellLecturer.innerText = subject.lecturer;
    });
}

const RenderSubjects = subjArr => {
    const table = document.getElementById('tableSubjects');
    RemoveOldTable(table);
    RenderTableHeader(table);
    RenderTableBody(table, subjArr);
}
