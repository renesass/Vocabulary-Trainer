var express = require('express');
var router = express.Router();
var Language = require('../models/Language');

router.get('/', function(req, res, next) {
	Language.findAll(function(error, languages) {
		if (error) throw new Error();
		
		res.render('languages/index', { title: 'Sprachen', languages: languages});
	});	
});

router.get('/new', function(req, res, next) {
	res.render('languages/details', { title: 'Neue Sprache'});
});

router.get('/edit/:id', function(req, res, next) {
	Language.findOneById(req.params.id, function(error, language) {
		if (error || language == null) throw new Error();
		
		res.render('languages/details', { 
			title: 'Sprache bearbeiten', 
			language: language
		});
	})
});

router.get('/delete/:id', function(req, res, next) {
	Language.findOneById(req.params.id, function(error, language) {
		language.delete(function(error) {
			if (error) throw new Error()
			res.redirect('/languages');
		});
	});
});

var save = function(req, res, next) {
	let id = req.params.id;
	let name = req.body.name;
	let main = (req.body["main"] ? 1 : 0);
	
	if (!name) {
		req.session.flash = {'type': 'error', 'message': 'Es muss ein Name angegeben werden.'};
		return res.redirect('back');
	}
	
	Language.findOneById(id, function(error, language) {
		if (error) throw new Error();
		
		if (language == null) language = new Language(null, name, main);
		else {
			language.name = name;
			language.main = main;
		}
		
		updateAll = (main == 0 ? false : true)
		language.save(function(error) {
			if (error) throw new Error();
			
			req.session.flash = {'type': 'success', 'message': 'Die Sprache wurde erfolgreich gespeichert.'};
			return res.redirect('/languages');
		}, updateAll);
	});

};

router.post('/new', save);
router.post('/edit/:id', save);

module.exports = router;
