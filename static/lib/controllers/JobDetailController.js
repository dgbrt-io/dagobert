app.controller('JobDetailCtrl', ['$scope', '$http', '$timeout', '$routeParams', 'appSocket', function ($scope, $http, $timeout, $routeParams, appSocket) {

	$scope.jobId = $routeParams.jobId;

	function formatJob() {
		$scope.job.logsStr = $scope.job.logs.map(function (line) {
			return '[' + line.timestamp + '] [' + line.streamType + '] ' + line.log;
		}).reduce(function (prev, curr) {
			return prev + curr;
		})
	}

	$scope.reload = function () {
		$http.get('/jobs/' + $scope.jobId)
			.success(function (job) {
				$scope.job = job;
				formatJob();

				appSocket.on('job_' + job._id, function (job) {
					console.log('Job update');

					$scope.job = job;
					formatJob();
				});
			})
			.error(function (err) {
				throw err;
			});
	}

	$scope.reload();
}]);
