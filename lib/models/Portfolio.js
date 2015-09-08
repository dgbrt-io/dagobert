var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var quoteSchema = new Schema(
{
	positions: [{

	}],
	mainPosition: {
		type: String
	}
});

module.exports = mongoose.model('Quote', quoteSchema);




