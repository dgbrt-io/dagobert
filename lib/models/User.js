var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	githubId: {
		type: Number,
		required: true,
		unique: true
	},
	accessToken: {
		type: String,
		required: true
	},
	repos: [{
		id: {
			type: Number,
			required: true,
			unique: true
		},
	}]
});

userSchema.plugin(require('mongoose-findorcreate'));

module.exports = mongoose.model('User', userSchema);


