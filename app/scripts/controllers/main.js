'use strict';

angular.module('nodeExampleApp')
  .controller('MainCtrl', function ($scope, $http) {
    $http.get('/api/awesomeThings').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });
     $scope.submit = function () {
            $scope.loading = true;
            var url = '/api/search/' + $scope.q + '/';
            $http({
                method: 'GET',
                url: url
            }).
                success(function (data, status, headers, config) {
                    $scope.numFound = data.results.numFound +" Results Found";
                    $scope.documents = data.results.documents;

                }).
                error(function (data, status, headers, config) {
                    $scope.name = 'Error!';
                });

        }
  });
