var express = require('express');
var router = express.Router();
var Vocabulary = require('../models/Vocabulary');

var Lesson = require('../models/Lesson');
var Vocabulary = require('../models/Vocabulary');

var setValue = function(id, value, area, attribute, callback) {
	if (!["0", "1"].includes(value)) return false;
	if (!["foreign-native", "native-foreign"].includes(area)) return false;
	
	id = Number(id);
	value = Number(value);
	
	Vocabulary.findOneById(id, function (error, vocabulary) {
		if (error || !vocabulary) return false;
		
		if (area == "foreign-native") vocabulary["foreign_to_native_" + attribute]  = value;
		else if (area == "native-foreign") vocabulary["native_to_foreign_" + attribute] = value;

		vocabulary.save(function(success) {
			callback();
		});
	});
}

router.get('/:id/set-status/:area/:value', function(req, res, next) {
	let params = req.params;
	setValue(params.id, params.value, params.area, "status", function() {
		res.send(true);
	});
});

router.get('/:id/set-mark/:area/:value', function(req, res, next) {
	let params = req.params;
	setValue(params.id, params.value, params.area, "mark", function() {
		res.send(true);
	});
});

module.exports = router;
