app.factory('$exceptionHandler', ['$injector', function($injector) {
  var $location;
  return function(exception, cause) {
  	$location = $location || $injector.get('$location');

  	if (exception.code === 401) {
  		return $location.path('/login');
  	}
  	else {
    	throw exception;
  	}
  };
}]);
