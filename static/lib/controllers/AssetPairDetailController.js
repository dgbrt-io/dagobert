app.controller('AssetPairDetailController', ['$scope', '$http', '$timeout', '$routeParams', 'appSocket', function ($scope, $http, $timeout, $routeParams, appSocket) {

	$scope.pair = $routeParams.pair;
	$scope.asset = $routeParams.pair.split('_')[0];
	$scope.currency = $routeParams.pair.split('_')[1];

	// Scope data
	$scope.data = [];

	$scope.yScale = [0, 100];
	$scope.chartData = [];

	$scope.currentQuote = null;

	function quoteToChartEntry(quote) {
		var date = new Date(quote.datetime);
		return [ date, quote.last ]
	}

	function show(data) {

		var key = 'Data';
		var values = [];

		var max = null;
		var min = null;

		var quotes = data;

		quotes.forEach(function (quote) {
			if (!max || quote.last > max) {
				$scope.max = quote.last;
			}
			if (!min || quote.last < min) {
				$scope.min = quote.last;
			}

			values.push(quoteToChartEntry(quote));
		});

		$scope.yScale = [min, max];
		$scope.chartData = [{
			key: key,
			values: values
		}]

		$scope.currentQuote = quotes[quotes.length - 1];

	}

	// Format functions
	$scope.valueFormat = function (val) {
		return val + $scope.currency;
	};

	$scope.xAxisTickFormat = function () {
		return function (val) {
			var date = new Date(val);
			return date.toLocaleTimeString();
		}
	};

	$scope.yAxisTickFormat = function () {
		return function (val) {
			return val;
		};
	}

	$scope.loadData = function () {
		$http.get('/assetPairs/' + $scope.pair + '/quotes')
			.success(function (data) {
				$scope.data = data;
				show($scope.data);
			})
			.error(function (err) {
				throw err;
			});
	}


	appSocket.on($scope.pair, function (newQuote) {
		console.log('Received new quote for', $scope.pair);
		$scope.data.push(newQuote);
		show($scope.data);
	});

	// Listen for events
	appSocket.on('hello', function (data) {
		console.log('Received message', data);
	});

	// Say hello
	appSocket.emit('hello', 'Hello from client');

	$scope.loadData();
}]);
