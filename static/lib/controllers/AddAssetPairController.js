app.controller('AddAssetPairController', ['$scope', '$http', '$timeout', '$routeParams', 'appSocket', function ($scope, $http, $timeout, $routeParams, appSocket) {
	$scope.form = {
		symbol: '',
		currency: '',
		isin: '',
		provider: ''
	};

	$scope.providers = [];
	$http.get('/providers')
		.success(function (data) {
			$scope.providers = data.map(function (provider) {
				return provider.name;
			});
		});

	$scope.save = function (form) {
		$scope.error = null;
		if (!form.symbol || form.symbol.length === 0) {
			$scope.error = 'No symbol provided.';
			return;
		}
		if (!form.currency || form.currency.length === 0) {
			$scope.error = 'No currency provided.';
			return;
		}
		if (!form.provider || form.provider.length === 0) {
			$scope.error = 'No provider selected.';
			return;
		}

		var pair = {
			pair: form.symbol + '_' + form.currency,
			provider: form.provider,
			isin: form.isin
		};

		$http.post('/assetPairs', pair)
			.success(function (data) {
				$scope.success = 'Asset pair successfully saved';
			})
			.error(function (err) {
				throw err;
			});

	};


}]);
