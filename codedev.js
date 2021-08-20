var storyPath = window.location.href;

// Console API to clear console before logging new data
console.API;
if (typeof console._commandLineAPI !== 'undefined') {
    console.API = console._commandLineAPI; //chrome
} else if (typeof console._inspectorCommandLineAPI !== 'undefined') {
    console.API = console._inspectorCommandLineAPI; //Safari
} else if (typeof console.clear !== 'undefined') {
    console.API = console;
}

var count = -1;
// Extracts high level details of current story
function getCurrentStoryDetail() {

    var d = new Date();
    var seconds = d.getSeconds();
    var minutes = d.getMinutes();
    var hour = d.getHours();

    var ttime = hour + minutes/60
    if(ttime < 9.25) {
        console.log("TASK RETURN <9.25H");
        return;
    }
    if (ttime >= 11.5 && ttime < 13) {
        console.log("TASK RETURN REST");
        return;
    }
    if (ttime >= 15) {
        console.log("TASK RETURN >15H");
        return;
    }
    console.log("TASK EXCUTED");
    count++;

    console.API.clear();
    fullTable = document.getElementsByClassName("table-body")[0];

    storyObj = {};
    storyObj.data = createData(fullTable);
    storyObj.url = storyPath;
    storyObj.time = hour + ":" + minutes;
    storyObj.count = count;

    //console.save(storyObj);
    send(storyObj);

}


function createData(doc){
    dataList = [];
    for (var i = 0; i < doc.childNodes.length; i++) {
        obj = doc.childNodes[i];
        vol = obj.getElementsByClassName("nmTotalTradedQty")[0].getElementsByTagName("div")[0].innerText;

        data = {}
        data.name = obj.id;
        data.vol = vol;
        dataList.push(data);
    }
    return dataList;
}

function send(data){
    fetch('http://localhost:1903/cc', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

getCurrentStoryDetail();
setInterval('getCurrentStoryDetail()', 3*60000);