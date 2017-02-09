angular.module('sampleApp')
  .controller('DetailCtrl', function($scope, $rootScope, $routeParams, Show, Upd, Delete) {
      Show.get({ _id: $routeParams.id }, function(expense) {
        $scope.expense = expense;
        $scope.update = function() {
            console.log(expense.time);
          Upd.update({ id: $routeParams.id, email: expense.email, time: expense.time, amount: expense.amount, descrip: expense.descrip});
        };
        $scope.delete = function(id){
          Delete.delete({ _id: id, email: expense.email});
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
    });