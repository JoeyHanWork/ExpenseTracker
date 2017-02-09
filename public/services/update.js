angular.module('sampleApp')
  .factory('Upd', function($http, $location, $rootScope, $window) {
    return {
      update: function(expense) {
        return $http.post('/auth/update', expense)
          .success(function(data) {
            $rootScope.currentUser = expense;
            $location.path('/operation');
          })
          .error(function(response) {
          });
      },
      add: function(expense) {
        return $http.post('/auth/add', expense)
          .success(function() {
            $rootScope.currentUser = expense;
            $location.path('/operation');
          })
          .error(function(response) {
          });
      }
    };
  });