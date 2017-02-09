angular.module('sampleApp')
  .controller('AddCtrl', function($scope, $rootScope, $routeParams, Upd) {
  	$scope.add = function() {
  		Upd.add({
  			email: $routeParams.id,
  			time: $scope.time,
  			amount: $scope.amount,
  			descrip: $scope.descrip
  		});
  	};
  
    $scope.dateOptions = {
        startingDay: 1
    };

    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };

    $scope.popup2 = {
        opened: false
    };
  });