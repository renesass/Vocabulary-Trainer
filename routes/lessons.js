var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.render('lessons', { title: 'Lektionen' });
});

module.exports = router;
