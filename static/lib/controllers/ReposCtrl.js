app.controller('ReposCtrl', ['$scope', '$http', '$timeout', '$routeParams', 'appSocket', function ($scope, $http, $timeout, $routeParams, appSocket) {


	$scope.resetFilters = function () {
		$scope.filters = {
			activated: {
				dagobert: {
					activated: true
				}
			},
			search: {
				full_name: ''
			}
		};
	}

	$scope.activate = function (repo) {
		$http.post('/github/user/repos/activated', repo)
			.success(function (msg) {
				$scope.resetFilters();
				$scope.reload();
			})
			.error(function (err) {
				throw err;
			});
	}

	$scope.deactivate = function (repo) {
		$http.delete('/github/user/repos/activated/' + repo.id)
			.success(function (msg) {
				$scope.resetFilters();
				$scope.reload();
			})
			.error(function (err) {
				throw err;
			});
	}

	$scope.reload = function () {
		$http.get('/github/user/repos')
			.success(function (repos) {
				$scope.repos = repos;
			})
			.error(function (err) {
				throw err;
			});
	}

	$scope.resetFilters();
	$scope.reload();
}]);
