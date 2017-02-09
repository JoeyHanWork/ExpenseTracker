angular.module('sampleApp')
  .factory('findAll', function($resource) {
    return $resource('/api/allExpenses');
  });