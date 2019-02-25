var Model = require('./Model');
const bcrypt = require('bcrypt');

class Vocabulary extends Model {
	constructor(id, lesson_id, foreign, pronunciation, native, foreign_to_native_status, foreign_to_native_mark, native_to_foreign_status, native_to_foreign_mark) {
		super(id);
		
		this.lesson_id = lesson_id;
		this.foreign = foreign;
		this.pronunciation = pronunciation;
		this.native = native;
		this.foreign_to_native_status = foreign_to_native_status;
		this.foreign_to_native_mark = foreign_to_native_mark;
		this.native_to_foreign_status = native_to_foreign_status;
		this.native_to_foreign_mark = native_to_foreign_mark;
	}
	
	save(callback) {
		var self = this;
		
		// update
		if (this.id) {
			Vocabulary.db.query("UPDATE vocabularies SET foreign_word = ?, pronunciation = ?, native_word = ?, foreign_to_native_status = ?, foreign_to_native_mark = ?, native_to_foreign_status = ?, native_to_foreign_mark = ? WHERE id = ?", [this.foreign, this.pronunciation, this.native, this.foreign_to_native_status, this.foreign_to_native_mark, this.native_to_foreign_status, this.native_to_foreign_mark, this.id], function (error, result) {
				if (error) return callback(false);

				callback(true)
			});
			
		// create new entry
		} else {
			let query = "INSERT INTO vocabularies (lesson_id, foreign_word, pronunciation, native_word, foreign_to_native_status, foreign_to_native_mark, native_to_foreign_status, native_to_foreign_mark) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
			let data = [this.lesson_id, this.foreign, this.pronunciation, this.native, this.foreign_to_native_status, this.foreign_to_native_mark, this.native_to_foreign_status, this.native_to_foreign_mark];
			Vocabulary.db.query(query, data, function (error, result) {
				if (error) return callback(false);
				
				self.id = result.insertId;
				callback(true);
			});
		}
	}
	
	delete(callback) {
		Vocabulary.db.query("DELETE FROM vocabularies WHERE id = ?", [this.id], function (error, result) {
			if (error) return callback(false);
				
			callback(true)
		});
	}
	
	static findOneById(id, callback) {
		if (!id) callback(false, null)
		
		this.db.query("SELECT * FROM vocabularies WHERE id = ?", [id], function (error, result) {
		    if (error || result.length != 1) return callback(true, null);
		    
		    let vocabularyData = result[0];
		    var vocabulary = new Vocabulary(
		    	vocabularyData.id,
		    	vocabularyData.lesson_id,
		    	vocabularyData.foreign_word,
		    	vocabularyData.pronunciation,
		    	vocabularyData.native_word,
		    	vocabularyData.foreign_to_native_status,
		    	vocabularyData.foreign_to_native_mark,
		    	vocabularyData.native_to_foreign_status,
		    	vocabularyData.native_to_foreign_mark
		    );
		    
		    return callback(false, vocabulary);    
		});
	} 
	
	static findAllByLessonId(id, callback) {
		this.db.query("SELECT * FROM vocabularies WHERE lesson_id = ?", [id], function (error, result) {
		    if (error) return callback(true, null);
		    
		    var vocabularies = [];
		    for (var i = 0; i < result.length; i++) {
			    var vocabularyData = result[i];
			    vocabularies.push(new Vocabulary(
			    	vocabularyData.id,
			    	vocabularyData.lesson_id,
			    	vocabularyData.foreign_word,
			    	vocabularyData.pronunciation,
			    	vocabularyData.native_word,
			    	vocabularyData.foreign_to_native_status,
			    	vocabularyData.foreign_to_native_mark,
			    	vocabularyData.native_to_foreign_status,
			    	vocabularyData.native_to_foreign_mark
			    ));
		    }
		    
		    return callback(false, vocabularies);    
		});
	}
}

module.exports = Vocabulary;