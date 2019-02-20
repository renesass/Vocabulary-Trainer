var express = require('express');
var router = express.Router();
var User = require('../models/User');

/* GET users listing. */
router.get('/', function(req, res, next) {
	req.session.reset();
	res.redirect('/');
});

module.exports = router;
