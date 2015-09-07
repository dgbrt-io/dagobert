var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var assetPairSchema = new Schema({
	pair: {
		type: String,
		required: true,
		unique: true
	},
	provider: {
		type: String,
		required: true
	},
	isin: {
		type: String
	}
});

module.exports = mongoose.model('AssetPair', assetPairSchema);


