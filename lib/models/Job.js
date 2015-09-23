var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var jobSchema = new Schema(
{
	status: String,
	repoId: Number,
	commit: {
		id: String,
		distinct: Boolean,
		message: String,
		timestamp: String,
		url: String,
		author:{
		  name: String,
		  email: String,
		  username: String
		},
		committer:{
		  name: String,
		  email: String,
		  username: String
		},
		added:[
			String
		],
		removed:[
			String
		],
		modified:[
			String
		]
	},
	worker: {
		name: String,
	},
	logs: [{
		type: String,
		msg: String
	}]
});

module.exports = mongoose.model('Job', jobSchema);




