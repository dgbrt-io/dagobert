app.controller('JobsCtrl', ['$scope', '$http', '$timeout', '$routeParams', 'appSocket', function ($scope, $http, $timeout, $routeParams, appSocket) {

	$scope.repoId = $routeParams.repoId;


	function formatJob(job) {
		job.logsStr = job.logs.map(function (line) {
			return '[' + line.timestamp + '] [' + line.streamType + '] ' + line.log;
		}).reduce(function (prev, curr) {
			return prev + curr;
		})
	}


	$scope.reload = function () {
		$http.get('/repos/' + $scope.repoId + '/jobs')
			.success(function (jobs) {
				$scope.jobs = jobs;

				$scope.jobs.forEach(function (job) {
					formatJob(job);
				});
			})
			.error(function (err) {
				throw err;
			});
	}



	$scope.reload();
}]);
