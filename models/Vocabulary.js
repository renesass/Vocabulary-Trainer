var Model = require('./Model');
const bcrypt = require('bcrypt');

class Vocabulary extends Model {
	constructor(lesson, zh, pinyin, de, status) {
		super(null);
		
		this.lesson = lesson;
		this.zh = zh;
		this.pinyin = pinyin;
		this.de = de;
		this.status = status;
	}
	
	save() {
		// update
		if (this.id) {
			//this.db.query("UPDATE ... ", [], function (error, result) {
				
			//});
			
		// create new entry
		} else {
			
		}
	}
	
	/*
	static findById(id, callback) {
		this.db.query("SELECT * FROM lessons WHERE id = ?", [id], function (error, result) {
		    if (error || result.length != 1) {
			    return callback(true, null);
			}
		    
		    var lesson = new User(result[0].id, result[0].name;
		    return callback(false, lesson);    
		});
	} */
}

module.exports = Vocabulary;