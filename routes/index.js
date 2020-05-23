//MainPage 라우터
var express = require('express');
var router = express.Router();
var ejs = require('ejs'),
    fs = require('fs');
function index(req, res) {
    fs.readFile('./public/index.html', 'utf8', function (error, data) {
        res.send(ejs.render(data, {}));
    });
}
module.exports = index;
