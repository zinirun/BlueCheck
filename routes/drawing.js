var ejs = require('ejs'),
    fs = require('fs');
var drawing = function (req, res) {
    var selected_dong = req.query.dong,
        selected_ho = req.query.ho;

    fs.readFile('./public/view_defact.html', 'utf8', function (error, data) {
        res.send(ejs.render(data, {
            dong: selected_dong,
            ho: selected_ho
        }));
    });
};
module.exports = drawing;