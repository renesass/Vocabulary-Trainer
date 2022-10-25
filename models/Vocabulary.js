var Model = require('./Model');
const bcrypt = require('bcrypt');

class Vocabulary extends Model {
	constructor(id, lesson_id, foreign, pronunciation, native, exampleSentence, additionalInfo, foreignNativeStatus, foreignNativeMark, nativeForeignStatus, nativeForeignMark) {
		super(id);

		this.lesson_id = lesson_id;
		this.foreign = foreign;
		this.pronunciation = pronunciation;
		this.native = native;
		this.exampleSentence = exampleSentence;
		this.additionalInfo = additionalInfo;
		this.foreignNativeStatus = foreignNativeStatus;
		this.foreignNativeMark = foreignNativeMark;
		this.nativeForeignStatus = nativeForeignStatus;
		this.nativeForeignMark = nativeForeignMark;
	}

	save(callback) {
		var self = this;

		// update
		if (this.id) {
			let query = "UPDATE vocabularies SET foreign_word = ?, pronunciation = ?, native_word = ?, example_sentence = ?, additional_info = ?, foreign_to_native_status = ?, foreign_to_native_mark = ?, native_to_foreign_status = ?, native_to_foreign_mark = ? WHERE id = ?";
			let data = [
				this.foreign,
				this.pronunciation,
				this.native,
				this.exampleSentence,
				this.additionalInfo,
				this.foreignNativeStatus, this.foreignNativeMark,
				this.nativeForeignStatus, this.nativeForeignMark,
				this.id
			];

			Vocabulary.db.query(query, data, function (error, result) {
				if (error) return callback(true);

				callback(false);
			});

			// create new entry
		} else {
			let query = "INSERT INTO vocabularies (lesson_id, foreign_word, pronunciation, native_word, example_sentence, additional_info, foreign_to_native_status, foreign_to_native_mark, native_to_foreign_status, native_to_foreign_mark) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
			let data = [
				this.lesson_id, this.foreign, this.pronunciation, this.native,
				this.exampleSentence, this.additionalInfo,
				this.foreignNativeStatus, this.foreignNativeMark,
				this.nativeForeignStatus, this.nativeForeignMark
			];

			Vocabulary.db.query(query, data, function (error, result) {
				if (error) return callback(true);

				self.id = result.insertId;
				callback(false);
			});
		}
	}

	delete(callback) {
		Vocabulary.db.query("DELETE FROM vocabularies WHERE id = ?", [this.id], function (error, result) {
			if (error) return callback(true);

			callback(false);
		});
	}

	static findOneById(id, callback) {
		if (!id) return callback(false, null)

		this.db.query("SELECT * FROM vocabularies WHERE id = ?", [id], function (error, result) {
			if (error || result.length != 1) return callback(true, null);

			let vocabularyData = result[0];
			var vocabulary = new Vocabulary(
				vocabularyData.id,
				vocabularyData.lesson_id,
				vocabularyData.foreign_word,
				vocabularyData.pronunciation,
				vocabularyData.native_word,
				vocabularyData.example_sentence,
				vocabularyData.additional_info,
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
					vocabularyData.example_sentence,
					vocabularyData.additional_info,
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