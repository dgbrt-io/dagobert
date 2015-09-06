app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/assets/:pair/quotes', {
        templateUrl: 'static/templates/assetQuotes.html',
        controller: 'AssetQuotesController'
      }).
      when('/assets', {
        templateUrl: 'static/templates/assets.html',
        controller: 'AssetsController'
      }).
      otherwise({
        redirectTo: '/assets'
      });
  }]);
