angular.module('sampleApp')
  .controller('SignupCtrl', function($scope, Auth) {
    $scope.signup = function() {
      Auth.signup({
        name: $scope.name,
        email: $scope.email,
        password: $scope.password
      });
    };
  });