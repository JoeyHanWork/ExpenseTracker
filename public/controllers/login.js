angular.module('sampleApp')
  .controller('LoginCtrl', function($scope, Auth) {
    $scope.login = function() {
      Auth.login({ email: $scope.email, password: $scope.password });
    };
    $scope.adminLogin = function() {
      Auth.adminLogin({ email: $scope.email, password: $scope.password, authorization: "admin" });
    };
  });