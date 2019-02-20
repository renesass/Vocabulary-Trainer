var express = require('express');
var router = express.Router();
var User = require('../models/User');

/* GET users listing. */
router.get('/', function(req, res, next) {
	// go next, if already logged in
	if (req.session.user) {
		res.redirect('/');
	}
	
	res.render('login', { title: 'Login' });
});

router.post('/', function(req, res, next) {
	User.findByMail(req.body.email, function(error, user) {
		if (!error && user.comparePassword(req.body.password)) {
			req.session.user = user;
				
			res.redirect('../');
		} 
		
		res.render('login', { title: 'Login', errorMessage: 'Fehler' });
	});
});

module.exports = router;
