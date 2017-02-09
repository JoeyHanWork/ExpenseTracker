angular.module('sampleApp')
  .controller('OperationCtrl', function($scope, $location, $rootScope, $routeParams, Show, Search) {
    $scope.email = $rootScope.currentUser.email;
    $scope.expenses = Show.query({email: $scope.email});
    $scope.isAdmin = function(){
        return  $rootScope.currentUser.authorization != null;
    };

    ($scope.search = function(){
        if($scope.stime==undefined && $scope.etime==undefined) $scope.expenses = Show.query({email: $scope.email});
        else if($scope.etime==undefined) $scope.expenses = Search.query({sDate: $scope.stime, eDate:0, email: $scope.email});
        else if($scope.stime==undefined) $scope.expenses = Search.query({sDate: 0, eDate:$scope.etime, email: $scope.email});
        else $scope.expenses = Search.query({sDate: $scope.stime, eDate:$scope.etime, email: $scope.email});
    })();

    ($scope.today = function() {
        $scope.dt = new Date();
    })();

    $scope.clear = function() {
        $scope.dt = null;
    };

    var today = new Date();

    $scope.dateOptions = {
        startingDay: 1
    };

    $scope.open2 = function() {
        $scope.popup2.opened = true;
    };

    $scope.popup2 = {
        opened: false
    };

    $scope.open1 = function() {
        $scope.popup1.opened = true;
    };

    $scope.popup1 = {
        opened: false
    };

    });