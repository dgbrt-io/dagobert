app.controller('AssetPairDetailController', ['$scope', '$http', '$timeout', '$routeParams', 'appSocket', function ($scope, $http, $timeout, $routeParams, appSocket) {

	$scope.pair = $routeParams.pair;
	$scope.asset = $routeParams.pair.split('_')[0];
	$scope.currency = $routeParams.pair.split('_')[1];

	// Scope data
	$scope.quotes = [];

	$scope.yScale = [0, 100];
	$scope.chartData = [];

	$scope.currentQuote = null;

	$scope.period = 0;


	function quoteToChartEntry(quote) {
		var date = new Date(quote.datetime);
		return [ date, quote.last ]
	}

	$scope.selectPeriod = function (index) {
		$scope.period = index;
		show($scope.data);
	};

	function show(data) {

		var key = 'Data';
		var values = [];

		var max = null;
		var min = null;

		var quotes = data.periods[$scope.period ? $scope.period : 0].quotes;

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


	appSocket.on($scope.pair, function (data) {
		console.log('Received quote', data);
		$scope.data = data;
		show($scope.data);
	});

	// Listen for events
	appSocket.on('hello', function (data) {
		console.log('Received message', data);
	});


	// Say hello
	appSocket.emit('hello', 'Hello from client');
}]);
