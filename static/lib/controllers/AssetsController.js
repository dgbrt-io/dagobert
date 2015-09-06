app.controller('AssetsController', ['$scope', '$http', '$timeout', 'appSocket', function ($scope, $http, $timeout, appSocket) {

	// Scope data
	$scope.data = [];

	$scope.loadData = function () {
		$scope.loading = true;
		$http.get('/assets')
			.success(function (data) {
				$scope.data = data;
				$scope.loading = false;
			})
			.error(function (err) {
				console.error(err);
				$scope.loading = false;
			});
	};

	$scope.loadData();
}]);
