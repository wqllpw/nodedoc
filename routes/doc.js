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

/* GET home page. */
/*router.param('id',function(req,res,next,id){
console.log('router param id:'+id);
next();
});*/
router.get('*',function(req,res) {
    var //arrPath = req.url.split('/').splice(2),
        docPath = path.join(__dirname, '../repos', req.url);

    //check file type
    fs.exists(docPath, function(exists){
        if(exists) {
            var fileStat = fs.lstatSync(docPath);

            if(fileStat.isDirectory()) {
                var jadePath = path.join(docPath, 'index.jade');

                fs.exists(jadePath, function(exists) {
                    var arrFiles = ls(docPath, req.url);

                    if(exists) {
                        fs.readFile(jadePath, 'utf-8', function(err, data) {
                            var fn = jade.compile(data, {filename: path.join(app.get('views'), 'layout.jade')});
                            var html = fn({files: arrFiles});

                            res.send(html);
                        });

                    }
                    else {
                        res.render('doc', {files: arrFiles});
                    }
                });

            }
            else {
                if(path.extname(docPath) == '.md') {
                    fs.readFile(docPath, 'utf-8', function(err, data){

                        res.render('md', {html: md.parse(data)});
                    });
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
