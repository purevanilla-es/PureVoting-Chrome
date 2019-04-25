now = (new Date).getTime();

var getJSON = function (url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
};

checkMatch()

function updateSites(){
    console.log("[Pure Vanilla] Updating voting sites list")
}

function checkMatch() {
    domain = window.location.hostname;

    if(localStorage.getItem("update")==null){
        updateSites()
    } else {
        if(now-localStorage.getItem("update")>43200){
            updateSites()
        } else {
            if(JSON.parse(localStorage.getItem("sites")).includes(domain)){
                console.log("[Pure Vanilla] This website is listed as a registered voting site")
            }
        }
    }
}