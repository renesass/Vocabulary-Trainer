var express = require('express');
var router = express.Router();

var Lesson = require('../models/Lesson');
var Vocabulary = require('../models/Vocabulary');

router.get('/', function(req, res, next) {
	Lesson.findAllByLanguageId(res.locals.selectedLanguage.id, function(error, lessons) {
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
		lesson.delete(function(error) {
			if (error) req.session.flash = { 'type': 'error', 'message': 'Die Lektion wurde nicht gelöscht.' }
			else req.session.flash = { 'type': 'success', 'message': 'Die Lektion wurde erfolgreich gelöscht.' }
			
			res.redirect('/lessons');
		});
	});
});

var save = function(req, res, next) {
	let id = req.params.id;
	let name = req.body.name;
	
	if (!name) {
		req.session.flash = {'type': 'error', 'message': 'Es muss ein Name angegeben werden.'};
		return res.redirect('back');
	}
	
	Lesson.findOneById(id, function (error, lesson) {
		if (error) return;
		if (lesson == null) lesson = new Lesson(null, res.locals.selectedLanguage.id, name);
		
		lesson.name = name;
		lesson.save(function(error) {
			if (error) throw new Error(); 
			
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
						oldVocabulary.delete(function(error) {
							if (error) throw new Error();
						});
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
						if (error) throw new Error();
						if (vocabulary == null) vocabulary = new Vocabulary(null, lesson.id, foreign, pronunciation, native, 0, 0, 0, 0);
						else {
							vocabulary.foreign = foreign;
							vocabulary.pronunciation = pronunciation;
							vocabulary.native = native;
						}

						vocabulary.save(function(error) {
							if (error) throw new Error();
						});						
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