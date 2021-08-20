const express = require('express');
const app = express();
const path = require('path');
const dotenv = require('dotenv');

const cors = require('cors');

const api = require('./services/api');
const fs = require("fs");

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(express.json());

dotenv.config();

// Set the default views directory to html folder
app.set('views', path.join(__dirname, 'html'));

// Set the folder for css & images, controllers and modules
app.use(express.static(path.join(__dirname,'CSS')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'controllers')));
app.use(express.static(path.join(__dirname, 'routes')));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", options => iotions.AllowAnyOrigin());
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use(cors({
    origin: '*'
}));

// Set the view engine to ejs
app.set('view engine', 'ejs');

var router = require('./routes');
app.use('/', router);

app.listen(process.env.SERVER_PORT, "0.0.0.0", () => console.log(`Server is running at ${process.env.SERVER_PORT}`));

api.updateCoPhieu();
setInterval(api.updateCoPhieu, 3*60000);