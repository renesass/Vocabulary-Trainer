var Model = require('./Model');
const bcrypt = require('bcrypt');

class Lesson extends Model {
	constructor(name) {
		super(null);
		
		this.name = name;
	}
	
	save(callback) {
		// update
		if (this.id) {
			Lesson.db.query("UPDATE lessons SET name = ? WHERE id = ?", [this.name, this.id], function (error, result) {
				if (error) callback(false);
				else callback(true)
			});
			
		// create new entry
		} else {
			Lesson.db.query("INSERT INTO lessons (name) VALUES (?)", [this.name], function (error, result) {
				if (error) callback(false);
				else callback(true)
			});
		}
	}
	
	static findById(id, callback) {
		/*
		this.db.query("SELECT * FROM lessons WHERE id = ?", [id], function (error, result) {
		    if (error || result.length != 1) {
			    return callback(true, null);
			}
		    
		    var lesson = new User(result[0].id, result[0].name;
		    return callback(false, lesson);    
		}); */
	}
	
	static findAll(callback) {
		
	}
}

module.exports = Lesson;