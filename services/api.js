const axios = require('axios').default;
const cheerio = require("cheerio");
const fs = require("fs");

const NodeCache = require( "node-cache" );
const myCache = new NodeCache();

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

function saveJson(obj, name, dir){
    var path = dir + "" + name;
    var count = obj.count;
    return new Promise(function(resolve, reject){
        fs.writeFile(path, JSON.stringify(obj, null, 2), (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Successfully written data to file " + name);
        resolve();
        });
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

function getCoPhieu(){
    return new Promise(function(resolve, reject){
        fs.readFile("__list.json", 'utf8', (err, data) => {
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
}

function updateCoPhieu(){
    console.log("Updating data...");
    getCoPhieu()
    .then(obj => {
        return readCoPhieu(obj)
    })
    .then(data => {
        obj = data[1]
        obj.value = data[0].value
        myCache.set("coPhieuValue", obj)
        myCache.set("coPhieuList", obj.data)
        return;
    })
    .then(() => console.log("Updated data!"));
}


function addCoPhieu(name, index){
    let listCp = myCache.get("coPhieuList");
    let listValue = myCache.get("coPhieuValue");

    if(listCp.includes(name)) return;

    listCp.splice(index, 0, name);

    listValue.data = listCp;
    listValue.value.splice(index, 0, ['0','grey']);

    console.log(listValue)

    myCache.set("coPhieuList", listCp)
    myCache.set("coPhieuValue", listValue)

    let obj = { data: listCp };
    saveJson(obj, "__list.json", "")
}

function removeCoPhieu(name){
    let listCp = myCache.get("coPhieuList");
    let listValue = myCache.get("coPhieuValue");

    var index = listCp.indexOf(name);
    if (index !== -1) {
        listCp.splice(index, 1);
        
        listValue.data = listCp;
        listValue.value.splice(index, 1);
    }

    myCache.set("coPhieuList", listCp)
    myCache.set("coPhieuValue", listValue)

    let obj = { data: listCp };
    saveJson(obj, "__list.json", "")
}

module.exports.createDate = createDate();
module.exports.checkApostrophe = checkApostrophe;
module.exports.saveJson = saveJson;
module.exports.readJson = readJson;
module.exports.readDir = readDir;

module.exports.getCoPhieu = getCoPhieu;
module.exports.readCoPhieu = readCoPhieu;
module.exports.updateCoPhieu = updateCoPhieu;
module.exports.addCoPhieu = addCoPhieu;
module.exports.removeCoPhieu = removeCoPhieu;

module.exports.myCache = myCache;