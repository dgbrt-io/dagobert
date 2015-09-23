var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var repoSchema = new Schema({
	repoId: {
		type: Number,
		required: true,
		unique: true
	}
});

module.exports = mongoose.model('Repo', repoSchema);


