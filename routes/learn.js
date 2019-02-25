var express = require('express');
var router = express.Router();
var Lesson = require('../models/Lesson');
var Vocabulary = require('../models/Vocabulary');
var array = require('../utils/array');

router.get('/', function(req, res, next) {
	Lesson.findAll(function(error, lessons) {
		if (error) throw new Error();
		
		let existingRun = false;
		if (req.session.run) existingRun = true;
		
		res.render('learn/index', { 
			title: 'Lernen',
			existingRun: existingRun,
			lessons: lessons
		});
	});
});

router.get('/run', function(req, res, next) {
	if (!req.session.run) throw new Error();
	
	if (req.session.run.order == "random" && req.session.run.frequency == "infinity") {
		req.session.run.vocabularyIds = array.shuffle(req.session.run.vocabularyIds);
	}
	
	let run = req.session.run;
	
	let currentVocabularyId = run.vocabularyIds[run.currentIndex];
	Vocabulary.findOneById(currentVocabularyId, function(error, vocabulary) {
		if (error) throw new Error();
		
		res.render('learn/details', { 
			title: 'Lernen',
			currentIndex: run.currentIndex + 1,
			maxIndex: run.vocabularyIds.length,
			direction: run.direction,
			frequency: run.frequency,
			order: run.order,
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
		
		if (req.session.run.direction == "foreign-native") vocabulary.foreign_to_native_status = (("set-0" in req.body) ? 0 : 1);
		else vocabulary.native_to_foreign_status = (("set-0" in req.body) ? 0 : 1);
		
		vocabulary.save(function(success) {
			if (run.currentIndex == run.vocabularyIds.length - 1) {
				// at the end? reset currentIndex and start again
				if (run.frequency = "infinity") {
					req.session.run.currentIndex = 0;
					return res.redirect('/learn/run');
				}
				
				delete req.session.run;
				res.redirect('/learn');
			} else {
				if (success && (run.frequency == "once" || (run.frequency == "infinity" && run.order == "index"))) req.session.run.currentIndex += 1;
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
		res.redirect('/learn');
	} else {
		if (direction == "foreign-native") direction = "foreign_to_native";
		else direction = "native_to_foreign"
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
				
				if (consideredTypes.includes("status-0") && vocabulary[direction + "_status"] == 0
					|| consideredTypes.includes("status-1") && vocabulary[direction + "_status"] == 1
					|| consideredTypes.includes("marked-0") && vocabulary[direction + "_mark"] == 0
					|| consideredTypes.includes("marked-1") && vocabulary[direction + "_mark"] == 1) {
					
					filteredVocabulariyIds.push(vocabulary.id);
				}
			}
		}
		
		if (filteredVocabulariyIds.length == 0) return res.redirect('/learn');
		
		if (order == "random") filteredVocabulariyIds = array.shuffle(filteredVocabulariyIds);
		
		// setup everyting in a session
		req.session.run = {
			"vocabularyIds": filteredVocabulariyIds,
			"currentIndex": 0,
			"direction": req.body.direction,
			"frequency": req.body.frequency,
			"order": req.body.order
		};
		
		res.redirect('/learn/run');
	});
});

module.exports = router;
