var zipper = require('zip-local'),
    fs = require('fs'),
    ejs = require('ejs');

function download_redirect(req, res) {
    createZip(__dirname + '/../public/resources/defact_images/', __dirname + '/../temp/images.zip', function () {
        console.log("이미지 폴더 압축 완료");
        const file = `${__dirname}/../temp/images.zip`;

        res.download(file, '전체-하자이미지-압축파일.zip', function (err) {
            if (err) {
                res.json({
                    err: err
                });
                return;
            } else {
                res.end();
                return;
            }
        });
    });
}

function createZip(source, out, finish) {
    zipper.sync.zip(source).compress().save(out);
    finish();
}

module.exports.toZip = download_redirect;
