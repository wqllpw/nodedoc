var express = require('express');
var router = express.Router();

/* GET home page. */
/*router.param('id',function(req,res,next,id){
console.log('router param id:'+id);
next();
});*/
router.get('/',function(req,res) {
res.render('index',{title:'Express'})
});
router.get('/index/:id', function(req, res) {
  res.render('index', { title: 'Express111' });
});

module.exports = router;
