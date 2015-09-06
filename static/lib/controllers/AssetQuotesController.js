app.controller('AssetQuotesController', ['$scope', '$http', '$timeout', '$routeParams', 'appSocket', function ($scope, $http, $timeout, $routeParams, appSocket) {

	$scope.pair = $routeParams.pair;
	$scope.asset = $routeParams.pair.split('_')[0];
	$scope.currency = $routeParams.pair.split('_')[1];

	// Scope data
	$scope.asset = null;

	$scope.yScale = [0, 100];
	$scope.chartData = [];


	function quoteToChartEntry(quote) {
		var date = new Date(quote.datetime);
		return [ date, quote.last ]
	}

	function show(quotes) {

		var key = 'Data';
		var values = [];

		var max = null;
		var min = null;

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


	// Non-scope functions

	$scope.loadData = function () {

		if (!$scope.pair) return console.error('Not a valid asset pair:', $scope.pair);

		$scope.loading = true;
		$http.get('/assets/' + $scope.pair + '/quotes')
			.success(function (data) {
				$scope.asset = data;
				show($scope.asset.quotes);
				$scope.loading = false;
			})
			.error(function (err) {
				console.error(err);
				$scope.loading = false;
			});
	};


	// Listen for events
	appSocket.on('hello', function (data) {
		console.log('Received message', data);
	});

	appSocket.on('quotes', function (data) {
		console.log('Received quote', data);

		if (data && data.asset && data.asset.symbol + '_' + data.asset.currency === $scope.pair) {
			$scope.asset.quotes.push(data.quote);
			show($scope.asset.quotes);
		}
	});

	// Say hello
	appSocket.emit('hello', 'Hello from client');

	$scope.loadData();
}]);
