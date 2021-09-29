const api = require('../services/api');
const axios = require('axios').default;
const fs = require('fs');

module.exports.home_get = function (req, res) {
    console.log('Request for `home` received');
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=SuperFarm%2CEthereum%2Caxie-infinity%2Csmooth-love-potion%2Cbitcoin&vs_currencies=usd';
    axios.get(url).then(response => {
        var obj = response.data;
        let coins = {};
        let i = 0;
        for (const [key, value] of Object.entries(obj)) {
            let coin = { coinId : key, usd : Object.values(value)[0] }
            coins[i] = coin;
            i++;
        }
        res.render('index', { coins : coins });
    })
}

module.exports.tools_get = function (req, res) {
    console.log('Request for `tools` received');
    api.readDir("__data")
    .then(function(files) {
        return Promise.all(files.map(file => api.readJson(file, "__data/")));
    })
    .then(function(list) {
        return api.readCoPhieu(list);
    })
    .then(function(data) {
        let cp = api.myCache.get("coPhieuValue");
        //console.log(cp);
        res.render('tools', { list : data[1] , cp : cp });
    })
}

module.exports.gallery_get = function (req, res) {
    console.log('Request for `gallery` received');
    let list = new Array();
    fs.readdir("images/pictures/", function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 
        files.forEach(function (file) {
            list.push(file);
        });
        res.render('gallery', { list : list });
    });
}


module.exports.data_get = function (req, res) {
    let myJson = req.body;      // your JSON
    let myValue = req.body.myKey;   // a value from your JSON
    console.log("RECEIVED POST DATA");
    res.send(myJson);   // echo the result back
    var name = myJson.count + ".json";
    api.saveJson(myJson, name, "__data/");
}

module.exports.cp_add = function (req, res) {
    let myJson = req.body;      // your JSON
    let myValue = req.body.myKey;   // a value from your JSON
    console.log("RECEIVED POST DATA (cp_add)");
    res.send(myJson);   // echo the result back

    var name = myJson.name;
    var index = myJson.index-1;
    if(index < 0) index = 0;
    api.addCoPhieu(name, index);
}

module.exports.cp_remove = function (req, res) {
    let myJson = req.body;      // your JSON
    let myValue = req.body.myKey;   // a value from your JSON
    console.log("RECEIVED POST DATA (cp_remove)");
    res.send(myJson);   // echo the result back
    var name = myJson.name;
    api.removeCoPhieu(name);
}