var mongoose = require('mongoose');

module.exports = mongoose.model('Asset', {
	provider: {
		type: String,
		required: true
	},
	isin: {
		type: String,
		unique: true
	},
	symbol: {
		type: String,
		unique: true,
		required: true
	},
	exchange: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	},
	currency: {
		type: String,
		required: true
	},
	quotes: [{
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
		}
	}]
});
