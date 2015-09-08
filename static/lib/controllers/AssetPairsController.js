app.controller('AssetPairsController', ['$scope', '$http', '$timeout', 'appSocket', function ($scope, $http, $timeout, appSocket) {

	// Scope data
	$scope.data = [];

	$scope.loadData = function () {
		$scope.loading = true;
		$http.get('/assetPairs')
			.success(function (data) {
				$scope.data = data;
				$scope.loading = false;
			})
			.error(function (err) {
				throw err;
			});
	};

	$scope.delete = function (assetPair) {
		$scope.loading = true;
		$http.delete('/assetPairs/' + assetPair.pair)
			.success(function (data) {
				$scope.success = 'Asset pair ' + assetPair.pair + ' successfully deleted';
				$scope.loadData();
				$scope.loading = false;
			})
			.error(function (err) {
				$scope.loading = false;
				throw err;
			});
	}

	$scope.loadData();
}]);
