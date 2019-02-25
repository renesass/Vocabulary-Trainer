var express = require('express');
var router = express.Router();

var Lesson = require('../models/Lesson');
var Vocabulary = require('../models/Vocabulary');

router.get('/', function(req, res, next) {
	Lesson.findAll(function(error, lessons) {
		if (error) return;
		
		res.render('lessons/index', { title: 'Lektionen', lessons: lessons});
	});	
});

router.get('/new', function(req, res, next) {
	res.render('lessons/details', { title: 'Neue Lektion' });
});

router.get('/edit/:id', function(req, res, next) {
	Lesson.findOneById(req.params.id, function(error, lesson) {
		res.render('lessons/details', { 
			title: 'Lektion bearbeiten',
			lesson: lesson
		});
	})
});

router.get('/delete/:id', function(req, res, next) {
	Lesson.findOneById(req.params.id, function(error, lesson) {
		lesson.delete(function() {});
	});
	
	res.redirect('/lessons');
});

var save = function(req, res, next) {
	let id = req.params.id;
	let name = req.body.name;
	
	if (!name) {
		if (id) return res.render('lessons/details', { title: 'Lektion bearbeiten', error: 'Fehler' });
		return res.render('lessons/details', { title: 'Neue Lektion', error: 'Fehler' });
	}
	
	Lesson.findOneById(id, function (error, lesson) {
		if (error) return;
		if (lesson == null) lesson = new Lesson(null, name);
		
		lesson.name = name;
		lesson.save(function(success) {
			if (!success) return; // TODO
			
			let vocabularyIdArray = req.body["id[]"];
			let foreignArray = req.body["foreign[]"];
			let pronunciationArray = req.body["pronunciation[]"];
			let nativeArray = req.body["native[]"];
			
			if (typeof vocabularyIdArray === 'string') {
				vocabularyIdArray = [vocabularyIdArray];
				foreignArray = [foreignArray];
				pronunciationArray = [pronunciationArray];
				nativeArray = [nativeArray];
			}
			
			// delete vocabularies, which was removed
			if (lesson.vocabularies) {
				let oldVocabularies = lesson.vocabularies;
				for (i = 0; i < oldVocabularies.length; i++) {
					let oldVocabulary = oldVocabularies[i];
					if (!vocabularyIdArray || !vocabularyIdArray.includes(oldVocabulary.id.toString())) {
						oldVocabulary.delete(function() {});
					}
				}
			}
			
			if (!vocabularyIdArray || vocabularyIdArray.length == 0) return res.redirect('/lessons');
			
			for (i = 0; i < vocabularyIdArray.length; i++) {
				let vocabularyId = vocabularyIdArray[i];
				let foreign = foreignArray[i];
				let pronunciation = pronunciationArray[i];
				let native = nativeArray[i];
				
				if (foreign.length != 0 && native.length != 0) {
					Vocabulary.findOneById(vocabularyId, function (error, vocabulary) {
						if (error) return;
						if (vocabulary == null) vocabulary = new Vocabulary(null, lesson.id, foreign, pronunciation, native, 0, 0, 0, 0);
						else {
							vocabulary.foreign = foreign;
							vocabulary.pronunciation = pronunciation;
							vocabulary.native = native;
						}

						vocabulary.save(function() {});						
					});
				}
			}
			
			res.redirect('/lessons');
		});
	});
}

router.post('/new', save);
router.post('/edit/:id', save);

module.exports = router;