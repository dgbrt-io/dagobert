app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/login', {
        templateUrl: 'static/templates/login.html',
        controller: 'LoginController'
      }).
      when('/jobs/:jobId', {
        templateUrl: 'static/templates/jobDetail.html',
        controller: 'JobDetailCtrl'
      }).
      when('/repos', {
        templateUrl: 'static/templates/repos.html',
        controller: 'ReposCtrl'
      }).
      when('/repos/:repoId/jobs', {
        templateUrl: 'static/templates/jobs.html',
        controller: 'JobsCtrl'
      }).
      when('/assetPairs/add', {
        templateUrl: 'static/templates/addAssetPair.html',
        controller: 'AddAssetPairController'
      }).
      when('/assetPairs/:pair', {
        templateUrl: 'static/templates/assetPairDetail.html',
        controller: 'AssetPairDetailController'
      }).
      when('/assetPairs', {
        templateUrl: 'static/templates/assetPairs.html',
        controller: 'AssetPairsController'
      }).
      otherwise({
        redirectTo: '/repos'
      });
  }]);
