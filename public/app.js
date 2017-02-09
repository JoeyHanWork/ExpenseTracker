var sampleApp = angular.module('sampleApp', ['ngResource', 'ngRoute', 'ngAnimate', 'ui.bootstrap', 'ui.bootstrap.datetimepicker']);

sampleApp.config(['$routeProvider',
  function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      }).
      when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      }).
      when('/shows/:id', {
        templateUrl: 'views/detail.html',
        controller: 'DetailCtrl'
      }).
      when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
      }).
      when('/operation', {
        templateUrl: 'views/opertion.html',
        controller: 'OperationCtrl'
      }).
      when('/add/:id', {
        templateUrl: 'views/add.html',
        controller: 'AddCtrl'
      }).
      when('/showAll', {
        templateUrl: 'views/show.html',
        controller: 'ShowCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
}]);
