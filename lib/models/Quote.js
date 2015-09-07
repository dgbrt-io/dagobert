var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var quoteSchema = new Schema(
{
	datetime: {
		type: Date,
		required: true
	},
	bid: {
		type: Number,
		required: true
	},
	ask: {
		type: Number,
		required: true
	},
	last: {
		type: Number,
		required: true
	},
	pair: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model('Quote', quoteSchema);




