angular.module('sampleApp')
  .factory('Delete', function($http, $location, $rootScope, $window) {
    return {
      delete: function(expense) {
        return $http.post('/api/delete', expense)
          .success(function(data) {
            $rootScope.currentUser = expense;
            $location.path('/operation');
          })
          .error(function(response) {
          });
      }
    };
  });