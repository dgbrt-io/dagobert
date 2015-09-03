app.controller('MainController', ['$scope', '$http', '$timeout', 'appSocket', function ($scope, $http, $timeout, appSocket) {

	// Scope data
	$scope.data = [];
	$scope.selectedIndex = -1;
	$scope.selectedItem = null;

	// Events
	appSocket.on('hello', function (data) {
		console.log('Received message', data);
	});
	appSocket.emit('hello', 'Hello from client');

	// Non-scope functions

	function showYearlyDistribution(distribution) {
		if (!distribution)
			return;

		var key = 'Data';
		var values = [];

		distribution.forEach(function (item) {
			var sales = parseInt(item.sales.replace('M', ''));
			console.log(sales);
			values.push([ item.quarter, sales ]);
		});

		$scope.chartData = [
			{
				key: key,
				values: values
			}
		];
	};

	$scope.selectCountryWithIndex = function (index) {
		if ($scope.data.length < 0 || index >= $scope.data.length)
			return;

		$scope.selectedIndex = index;
		$scope.selectedItem = $scope.data[index];
		showYearlyDistribution($scope.selectedItem.country_data.yearly_distribution);

	};

	$scope.loadData = function () {
		$scope.loading = true;
		$http.get('/mdw/assets')
			.success(function (data) {
				console.log(data);
				$scope.data = data;
				$scope.selectCountryWithIndex(0);
				$scope.loading = false;
			})
			.error(function (err) {
				console.error(err);
				$scope.loading = false;
			});
	};

	//$scope.loadData();
}]);
