const OpenTab = tabContentId => {
    //hide all tabcontent
    const tabContent = Array.from(document.getElementsByClassName('tabContent'));
    tabContent.forEach(tab => tab.style.display = "none");

    document.getElementById(tabContentId).style.display = "block";
}

document.getElementById('btnMonth').onclick = () => {
    OpenTab('Month');
}
document.getElementById('btnDay').onclick = () => {
    OpenTab('Day');
}
document.getElementById('btnInfo').onclick = () => {
    OpenTab('Account');
}