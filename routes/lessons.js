var express = require('express');
var router = express.Router();

var Lesson = require('../models/Lesson');
var Vocabulary = require('../models/Vocabulary');

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.render('lessons/index', { title: 'Lektionen' });
});

router.get('/new', function(req, res, next) {
	res.render('lessons/new', { title: 'Neue Lektion' });
});

router.post('/new', function(req, res, next) {
	let lessonName = req.body.name;
	var lesson = new Lesson(lessonName);
	lesson.save();
	
	/*
	let zhArray = req.body["zh[]"];
	let pinyinArray = req.body["pinyin[]"];
	let deArray = req.body["de[]"];
	
	for (i = 0; i < zhArray.length; i++) { 
		var vocabulary = new Vocabulary(lesson, zhArray[i], pinyinArray[i], deArray[i], 0);
		console.log(vocabulary);
		// vocabulary.save();
	} */
	
	res.render('lessons/new', { title: 'Neue Lektion' });
});

module.exports = router;
