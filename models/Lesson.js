var Model = require('./Model');
var Vocabulary = require('./Vocabulary');
var async = require('async');

class Lesson extends Model {
	constructor(id, name) {
		super(id);
		
		this.name = name;
	}
	
	save(callback) {
		var self = this;
		
		// update
		if (this.id) {
			Lesson.db.query("UPDATE lessons SET name = ? WHERE id = ?", [this.name, this.id], function (error, result) {
				if (error) callback(false);
				else callback(true)
			});
			
		// create new entry
		} else {
			Lesson.db.query("INSERT INTO lessons (name, created) VALUES (?, ?)", [this.name, new Date()], function (error, result) {
				if (error) return callback(false);
				
				self.id = result.insertId;
				callback(true);
			});
		}
	}
	
	delete(callback) {
		Vocabulary.db.query("DELETE FROM lessons WHERE id = ?", [this.id], function (error, result) {
			if (error) return callback(false);
				
			callback(true)
		});
	}
	
	addVocabularies(callback) {
		var self = this;

		// add vocabularies
		Vocabulary.findAllByLessonId(self.id, function(error, vocabularies) {
			if (error) return callback(true);
					  
			self.vocabularies = [];
			for (var j = 0; j < vocabularies.length; j++) {
				self.vocabularies.push(vocabularies[j]);
			}
					
			return callback(false); 	
		});
	}
	
	static findOneById(id, callback) {
		if (!id) return callback(false, null)
		
		this.db.query("SELECT * FROM lessons WHERE id = ?", [id], function (error, result) {
		    if (error || result.length != 1) return callback(true, null);
		    
		    const lessonData = result[0];
		    var lesson = new Lesson(lessonData.id, lessonData.name);
		    
		    lesson.addVocabularies(function (error) {
			    if (error) return callback(true, null);
			    
			    callback(false, lesson);
		    });
		}); 
	}
	
	static findAll(callback) {		
		this.db.query("SELECT * FROM lessons ORDER BY created DESC", function (error, result) {
		    if (error) return callback(true, null);
		    
		    var lessons = [];
		    
		    // first create lesson objects from the result
		    for (var i = 0; i < result.length; i++) {
				var lessonData = result[i];
			    var lesson = new Lesson(lessonData.id, lessonData.name);
			    lessons.push(lesson);
			}
		    
		    // now add the vocabularies
		    async.eachSeries(lessons, function iteratee(lesson, callback) {
			    lesson.addVocabularies(callback);
			}, function(error) {
				if (error) return callback(true, null);
				return callback(false, lessons);
			});
		}); 
	}
}

module.exports = Lesson;