angular.module('sampleApp')
  .factory('Auth', function($http, $location, $rootScope, $window) {
    var token = $window.localStorage.token;
    if (token) {
      var payload = JSON.parse($window.atob(token.split('.')[1]));
      $rootScope.currentUser = payload.user;
    }

    return {
      login: function(user) {
        return $http.post('/auth/login', user)
          .success(function(data) {
            $window.localStorage.token = data.token;
            var payload = JSON.parse($window.atob(data.token.split('.')[1]));
            $rootScope.currentUser = payload.user;
            $location.path('/operation');
          })
          .error(function() {
            delete $window.localStorage.token;
          });
      },
      adminLogin: function(admin) {
        return $http.post('/auth/adminLogin', admin)
          .success(function(data) {
            $rootScope.currentUser = admin;
            $location.path('/operation');
          })
          .error(function() {
            delete $window.localStorage.token;
          });
      },
      signup: function(user) {
        return $http.post('/auth/signup', user)
          .success(function() {
            $location.path('/operation');
          })
          .error(function(response) {
          });
      },
      logout: function() {
        delete $window.localStorage.token;
        $rootScope.currentUser = null;
      }
    };
  });