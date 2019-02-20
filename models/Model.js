let db = require('../db');

class Model {
	constructor(id) {
		this.id = id;
	}
}

Model.db = db;
module.exports = Model;