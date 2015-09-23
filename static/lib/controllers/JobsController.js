app.controller('JobsCtrl', ['$scope', '$http', '$timeout', '$routeParams', 'appSocket', function ($scope, $http, $timeout, $routeParams, appSocket) {

	$scope.repoId = $routeParams.repoId;

	$scope.reload = function () {
		$http.get('/repos/' + $scope.repoId + '/jobs')
			.success(function (jobs) {
				$scope.jobs = jobs;
			})
			.error(function (err) {
				throw err;
			});
	}

	$scope.reload();
}]);
