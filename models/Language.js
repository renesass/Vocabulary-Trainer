var Model = require('./Model');
var async = require('async');

class Language extends Model {
	constructor(id, name, main) {
		super(id);
		
		this.name = name;
		this.main = main;
	}
	
	save(callback, updateMains = true) {
		var self = this;
		
		// update
		if (this.id) {
			Language.db.query("UPDATE languages SET name = ?, main = ? WHERE id = ?", [this.name, this.main, this.id], function (error, result) {
				if (error) return callback(true);
				
				if (updateMains) {
					self.updateMains(function(error) {
						if (error) return callback(true);
						callback(false);
					});
				} else {
					callback(false);
				}
			});
			
		// create new entry
		} else {
			Language.db.query("INSERT INTO languages (name, main) VALUES (?, ?)", [this.name, this.main], function(error, result) {
				if (error) return callback(true);
				
				self.id = result.insertId;
				if (updateMains) {
					self.updateMains(function(error) {
						if (error) return callback(true);
						callback(false);
					});
				} else {
					callback(false);
				}
			});
		}
	}
	
	updateMains(callback) {
		let self = this;
		
		Language.findAll(function(error, languages) {
			async.eachSeries(languages, function iteratee(language, callback) {
				if (language.main == 1 && language.id != self.id) {
					language.main = 0;
					language.save(callback, false);
				} else {
					callback(false);
				}
			}, function(error) {
				if (error) return callback(true);
				callback(false);
			});
		});
	}
	
	delete(callback) {
		Language.db.query("DELETE FROM languages WHERE id = ?", [this.id], function (error, result) {
			if (error) return callback(true);
				
			callback(false)
		});
	}
	
	static findOneById(id, callback) {
		if (!id) return callback(false, null)
		
		this.db.query("SELECT * FROM languages WHERE id = ?", [id], function (error, result) {
		    if (error || result.length != 1) return callback(true, null);
		    
		    const languageData = result[0];
		    var language = new Language(languageData.id, languageData.name, languageData.main);
		    
		    callback(false, language);
		}); 
	}
	
	static findAll(callback) {		
		this.db.query("SELECT * FROM languages", function (error, result) {
		    if (error) return callback(true, null);
		    
		    var languages = [];
		    
		    // first create lesson objects from the result
		    for (var i = 0; i < result.length; i++) {
				var languageData = result[i];
			    var language = new Language(languageData.id, languageData.name, languageData.main);
			    languages.push(language);
			}
			
			callback(false, languages);
		}); 
	}
	
	static findMain(callback) {
		this.db.query("SELECT * FROM languages WHERE main = 1", function (error, result) {
		    if (error || result.length != 1) return callback(true, null);
		    
		    const languageData = result[0];
		    var language = new Language(languageData.id, languageData.name, languageData.main);
		    
		    callback(false, language);
		}); 
	}
}

module.exports = Language;