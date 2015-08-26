var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var assetSchema = new Schema({
	provider: {
		type: String,
		required: true
	},
	isin: {
		type: String
	},
	symbol: {
		type: String,
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
assetSchema.index({ symbol: 1, currency: 1}, { unique: true });

module.exports = mongoose.model('Asset', assetSchema);


