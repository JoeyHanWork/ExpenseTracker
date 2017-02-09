angular.module('sampleApp')
  .controller('ShowCtrl', function($scope, $location, $rootScope, $routeParams, findAll) {
    $scope.expenses = findAll.query();
  });