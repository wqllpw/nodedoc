var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
/*router.param('id',function(req,res,next,id){
console.log('router param id:'+id);
next();
});*/
router.get('*',function(req,res) {
    var //arrPath = req.url.split('/').splice(2),
        docPath = path.join(__dirname, '../views/doc', req.url); 

    console.log(req.url);

    res.render('doc', {title: docPath})
});

module.exports = router;
