const axios = require("axios");
const cheerio = require("cheerio");

function getCoPhieu(name) {
    const url = `https://www.stockbiz.vn/Stocks/${name}/Overview.aspx`;
    return axios.get(url)
    .then(({data}) => {
        return new Promise((resolve, reject) => {
            const $ = cheerio.load(data);
            const listItems = $("#stockAvgVolume10d .value");

            const colorItems = $(".valueContent font");
            var color
            colorItems.each((idx, el) => {
              color = $(el).attr().color;
            });

            var value;
            listItems.each((idx, el) => {
              value = $(el).text().trim();
            });
            resolve([value, color])
        })
    });
}

function requestData(){
    return axios.get('http://localhost:1903/cp-list')
      .then(response => {
          return response.data
      })
}

function sendData(data){
    return axios.post('http://localhost:1903/cp-update', data)
    .then(function (response) {
        return response.data;
    })
    .catch(function (error) {
        console.log(error);
    })
}

function update(){
    console.log("[0] Starting...")
    return new Promise(function(resolve, reject){
        console.log("[1] Requesting data...")
        obj = requestData()
        resolve(obj)
    })
    .then(obj => {
        console.log("[2] Processing data...")
        list = obj.data;
        return Promise.all(list.map(name => getCoPhieu(name)))
        .then((data) => {
            return ([data, obj])
        })
    })
    .then(data => {
        console.log("[3] Sending data...")
        obj = data[1]
        obj.value = data[0]
        return sendData(obj)
    })
    .then(data => {
        console.log("[4] Sent!")
    });
}

update();
setInterval(update, 60000*10)