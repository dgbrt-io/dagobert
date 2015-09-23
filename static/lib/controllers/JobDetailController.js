app.controller('JobDetailCtrl', ['$scope', '$http', '$timeout', '$routeParams', 'appSocket', function ($scope, $http, $timeout, $routeParams, appSocket) {

	$scope.jobId = $routeParams.jobId;

	$scope.reload = function () {
		$http.get('/jobs/' + $scope.jobId)
			.success(function (job) {
				$scope.job = job;

				appSocket.on('job_' + job._id, function (job) {
					console.log('Job update')
					$scope.job = job;
				});
			})
			.error(function (err) {
				throw err;
			});
	}

	$scope.reload();
}]);
