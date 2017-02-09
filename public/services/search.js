angular.module('sampleApp')
  .factory('Search', function($resource) {
    return $resource('/api/search/:sDate/:eDate/:email');
  });