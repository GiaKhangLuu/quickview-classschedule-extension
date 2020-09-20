const OpenTab = tabContentId => {
    //hide all tabcontent
    const tabContent = Array.from(document.getElementsByClassName('tabContent'));
    tabContent.forEach(tab => tab.style.display = "none");

    document.getElementById(tabContentId).style.display = "block";
}

const btnDay = document.getElementById('btnDay');

btnDay.onclick = () => {
    OpenTab('Day');
}

document.getElementById('btnInfo').onclick = () => {
    OpenTab('Account');
}

