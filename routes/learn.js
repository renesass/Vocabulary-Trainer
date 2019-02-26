var express = require('express');
var router = express.Router();
var Lesson = require('../models/Lesson');
var Vocabulary = require('../models/Vocabulary');
var array = require('../utils/array');

router.get('/', function(req, res, next) {
	Lesson.findAllByLanguageId(res.locals.selectedLanguage.id, function(error, lessons) {
		if (error) throw new Error();
		
		let existingRun = false;
		if (req.session.run) existingRun = true;
		
		// just show lessons for current language
		let filteredLessons = [];
		for (var i = 0; i < lessons.length; i++) {
			let lesson = lessons[i];
			if (lesson.languageId == res.locals.selectedLanguage.id) {
				filteredLessons.push(lesson);
			}
		}
		
		res.render('learn/index', { 
			title: 'Lernen',
			existingRun: existingRun,
			lessons: filteredLessons
		});
	});
});

router.get('/run', function(req, res, next) {
	let run = req.session.run;
	if (!run) throw new Error();
	
	if (run.oder == "random" && .run.frequency == "infinity") {
		req.session.run.vocabularyIds = array.shuffle(req.session.run.vocabularyIds);
		run = req.session.run;
	}
	
	let currentVocabularyId = run.vocabularyIds[run.currentIndex];
	Vocabulary.findOneById(currentVocabularyId, function(error, vocabulary) {
		if (error) throw new Error();
		
		let showPronunciation = (vocabulary.pronunciation == "" ? false : true);
		
		res.render('learn/details', { 
			title: 'Lernen',
			currentIndex: run.currentIndex + 1,
			maxIndex: run.vocabularyIds.length,
			direction: run.direction,
			frequency: run.frequency,
			order: run.order,
			showPronunciation: showPronunciation,
			vocabulary: vocabulary
		});
	});
	
});

router.post('/run/next', function(req, res, next) {
	let run = req.session.run;
	if (!run) throw new Error();
	
	// save
	let currentVocabularyId = run.vocabularyIds[run.currentIndex];
	Vocabulary.findOneById(currentVocabularyId, function(error, vocabulary) {
		if (error) throw new Error();
		
		if (run.direction == "foreign-native") vocabulary.foreignNativeStatus = (("set-0" in req.body) ? 0 : 1);
		else vocabulary.nativeForeignStatus = (("set-0" in req.body) ? 0 : 1);
		
		vocabulary.save(function(error) {
			if (error) throw new Error();
			
			if (run.currentIndex == run.vocabularyIds.length - 1) {
				// at the end? reset currentIndex and start again
				if (run.frequency == "infinity") {
					req.session.run.currentIndex = 0;
					return res.redirect('/learn/run');
				}
				
				delete req.session.run;
				res.redirect('/learn');
			} else {
				if (run.frequency == "once" || (run.frequency == "infinity" && run.order == "index")) req.session.run.currentIndex += 1;
				res.redirect('/learn/run');
			}
		});
	});
});

router.post('/', function(req, res, next) {
	let lessonIds = req.body["lessonIds[]"];
	let direction = req.body.direction;
	let consideredTypes = req.body.consideredTypes;
	let order = req.body.order;
	let frequency = req.body.frequency;
	
	// convert to array
	if (typeof lessonIds === "string") lessonIds = [lessonIds];
	if (typeof consideredTypes === "string") consideredTypes = [consideredTypes];
	
	if (!lessonIds || !consideredTypes || !["foreign-native", "native-foreign"].includes(direction)) {
		req.session.flash = {'type': 'error', 'message': 'Das Formular muss ordnungsgemäß ausgefüllt werden.'}
		return res.redirect('back');
	} else {
		if (direction == "foreign-native") direction = "foreignNative";
		else direction = "nativeForeign"
	}
	
	Lesson.findAll(function(error, lessons) {
		if (error) throw new Error();
		
		let filteredVocabulariyIds = [];
		for (var i = 0; i < lessons.length; i++) {
			let lesson = lessons[i];
			let vocabularies = lesson.vocabularies;
			
			// just consider vocabularies from requested lesson ids
			if (!lessonIds.includes(lesson.id.toString())) continue;
			
			// iterate over the vocabularies
			for (var j = 0; j < vocabularies.length; j++) {
				let vocabulary = vocabularies[j];
				
				if (consideredTypes.includes("status-0") && vocabulary[direction + "Status"] == 0
					|| consideredTypes.includes("status-1") && vocabulary[direction + "Status"] == 1
					|| consideredTypes.includes("marked-0") && vocabulary[direction + "Mark"] == 0
					|| consideredTypes.includes("marked-1") && vocabulary[direction + "Mark"] == 1) {
					
					filteredVocabulariyIds.push(vocabulary.id);
				}
			}
		}
		
		if (filteredVocabulariyIds.length == 0) {
			req.session.flash = {'type': 'error', 'message': 'Bei den angegebenen Kriterien wurden keine Vokabeln gefunden.'}
			return res.redirect('back');
		}
		
		if (order == "random") filteredVocabulariyIds = array.shuffle(filteredVocabulariyIds);
		
		// setup everyting in a session
		req.session.run = {
			"vocabularyIds": filteredVocabulariyIds,
			"currentIndex": 0,
			"direction": direction,
			"frequency": frequency,
			"order": order
		};
		
		res.redirect('/learn/run');
	});
});

module.exports = router;