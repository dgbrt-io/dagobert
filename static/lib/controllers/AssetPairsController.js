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
				console.error(err);
				$scope.loading = false;
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
				$scope.error = err;
				console.error(err);
				$scope.loading = false;
			});
	}

	$scope.loadData();
}]);
