function error (code, str) {
	return {
		type: 'error',
		message: str,
		code: code
	}
}

function avg(collection, field, options) {

	if (options && options.weight) {
		var total = collection.reduce(function (sum, elm) {
			return sum + elm[options.weight];
		}, 0);
	}
	else {
		var total = collection.length;
	}

	return collection.map(function (elm) {
		var ratio = elm[field] / total;

		if (options.weight) {
			ratio *= elm[options.weight];
		}

		return ratio;
	})
	.reduce(function(sum, num) {
		return sum + num;
	}, 0);
}

function variance (collection, field, options) {
	if (options && options.weight) {
		var total = collection.reduce(function (sum, elm) {
			return sum + elm[options.weight];
		}, 0);
	}
	else {
		var total = collection.length;
	}

	var average = avg(collection, field, options);

	return collection.map(function (elm) {
		var ratio = Math.pow(elm[field] - average, 2) / total;

		if (options.weight) {
			ratio *= elm[options.weight];
		}
		return ratio;
	})
	.reduce(function (sum, num) {
		return sum + num;
	}, 0);
}

function stdDev (collection, field, options) {
	return Math.pow(variance(collection, field, options), 1/2);
}

module.exports = {
	error : error,
	avg : avg,
	variance: variance,
	stdDev: stdDev
};
