var Model = require('./Model');
const bcrypt = require('bcrypt');

class User extends Model {
	constructor(id, mail, password) {
		super(id);
		
		this.mail = mail;
		this.password = password;
	}
	
	comparePassword(otherPassword) {
		if (bcrypt.compareSync(otherPassword, this.password)) {
			return true;
		}
		
		return false;
	}
	
	save() {
		this.db.query("UPDATE ... ", [], function (error, result) {
			
		});
	}
	
	static findByMail(mail, callback) {
		this.db.query("SELECT * FROM users WHERE mail = ?", [mail], function (error, result) {
		    if (error || result.length != 1) {
			    return callback(true, null);
			}
		    
		    var user = new User(result[0].id, result[0].mail, result[0].password);
		    return callback(false, user);    
		});
	}
}

module.exports = User;