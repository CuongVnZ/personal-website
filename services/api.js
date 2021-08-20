const axios = require('axios').default;
const cheerio = require("cheerio");
const fs = require("fs");

if(typeof(String.prototype.trim) === "undefined")
{
    String.prototype.trim = function() 
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

function createDate() {
    today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //As January is 0.
    var yyyy = today.getFullYear(); 
    const noTimeDate = dd+'-'+mm+'-'+yyyy+'-';
    return noTimeDate;
}

function checkApostrophe(data) { // Remove Apostrophe from string
    const newData = data;
    const regex = /'/g; // Regular expression to remove all occurences of '
    for(const key of Object.keys(newData)) {
        var str = newData[key];
        if(typeof str === 'string')
            if(str.includes("'")) newData[key] = str.replace(regex, "");

    }
    return newData;
}

/* (async () => {

	const url = `https://axieinfinity.com/`;

	const axiosResponse = await axios.get(url);

	console.log('axiosResponse', axiosResponse.data, axiosResponse.status);


})(); */

function saveJson(obj, name, dir){
    var path = dir + "" + name;
    var count = obj.count;
    fs.writeFile(path, JSON.stringify(obj, null, 2), (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Successfully written data to file " + name);
    });
}

function readJson(filename, folder){
    var dir = folder+filename;
    return new Promise(function(resolve, reject){
        fs.readFile(dir, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            } else {
                var obj = {}
                obj = JSON.parse(data);
                resolve(obj);
            }
        });
    });
}

function readDir(dir){
    return new Promise(function(resolve, reject){
        fs.readdir(dir, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            } else {
                resolve(data);
            }
        });
    });
}

function readCoPhieu(others){
    return new Promise(function(resolve, reject){
        fs.readFile("__cophieu.json", 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            } else {
                var obj = {}
                obj = JSON.parse(data);
                resolve([obj, others]);
            }
        });
    });
}

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

function updateCoPhieu(){
    new Promise(function(resolve, reject){
        fs.readFile("__cophieu.json", 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            } else {
                var obj = {}
                obj = JSON.parse(data);
                resolve(obj);
            }
        });
    })
    .then(obj => {
        temp = obj.data;
        return Promise.all(temp.map(name => getCoPhieu(name)))
        .then((data) => {
            return ([data, obj])
        })
    })
    .then(data => {
        obj = data[1]
        obj.value = data[0]
        return saveJson(obj, "__cophieu.json", "")
    });
}

module.exports.createDate = createDate();
module.exports.checkApostrophe = checkApostrophe;
module.exports.saveJson = saveJson;
module.exports.readJson = readJson;
module.exports.readDir = readDir;
module.exports.readCoPhieu = readCoPhieu;
module.exports.updateCoPhieu = updateCoPhieu;