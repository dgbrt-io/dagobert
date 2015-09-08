app.controller('RootCtrl', ['$scope', '$http', '$timeout', '$routeParams', 'appSocket', function ($scope, $http, $timeout, $routeParams, appSocket) {
	$http.get('/github/user')
		.success(function (user) {
			$scope.user = user;
		})
		.error(function (err) {
			throw err;
		});
}]);
