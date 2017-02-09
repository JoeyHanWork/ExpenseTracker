angular.module('sampleApp')
  .factory('Show', function($resource) {
    return $resource('/api/expenses/:_id');
  });