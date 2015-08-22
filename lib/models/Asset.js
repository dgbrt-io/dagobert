var mongoose = require('mongoose');

module.exports = mongoose.model('Asset', {
	isin: {
		type: String,
		unique: true
	},
	symbol: {
		type: String,
		unique: true
	},
	exchange: String,
	type: String,
	currency: String,
	quotes: [{
		datetime: Date,
		bid: Number,
		ask: Number,
		last: Number
	}]
});
