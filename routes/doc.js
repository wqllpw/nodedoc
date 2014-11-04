var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var md = require('markdown');
var jade = require('jade');
var app = express();

function ls(dir, relPath) {
    var files = fs.readdirSync(dir);
    var arrFiles = [];

    for(item in files) {

        var fname = files[item];

        if(path.extname(fname) == '.jade') continue;

        var fpath = path.join(dir, fname);
        var stat = fs.lstatSync(fpath);
    
        arrFiles.push({
            name: fname,
            path: path.join('/doc', relPath, fname),
            stat: stat
        });
    }

    return arrFiles;

}

/* GET doc */
router.get('*',function(req,res) {
    var requrl = res.locals.path = decodeURIComponent(req.params[0]);
    var docPath = path.join(__dirname, '../repos', res.locals.path);

    //check file type
    fs.exists(docPath, function(exists){
        if(exists) {
            var fileStat = fs.lstatSync(docPath);

            if(fileStat.isDirectory()) {
                var jadePath = path.join(docPath, 'index.jade');

                fs.exists(jadePath, function(exists) {
                    var arrFiles = ls(docPath, requrl);

                    if(exists) {
                        fs.readFile(jadePath, 'utf-8', function(err, data) {
                            var fn = jade.compile(data, {
                                    filename: path.join(app.get('views'), 'layout.jade')
                                });
                            var html = fn({files: arrFiles, req:req, res:res});

                            res.send(html);
                        });

                    }
                    else {
                        res.render('doc', {files: arrFiles, req:req, res:res});
                    }
                });

            }
            else {
                if(path.extname(docPath) == '.md') {
                    fs.readFile(docPath, 'utf-8', function(err, data){

                        res.render('md', {html: md.parse(data), req: req, res: res});
                    });
                }
                else if(/\.(?:html|htm|js|css|txt|jpg|png|gif)$/.test(requrl)) {
                    res.sendFile(docPath);
                }
                else {
                    res.download(docPath);
                }
            }
        }
        else {
            res.sendStatus(404);
        }
    });
});

module.exports = router;
