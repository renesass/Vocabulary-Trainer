var express = require('express');
var router = express.Router();

var User = require('../models/User.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.redirect('../lessons');
});

module.exports = router;
