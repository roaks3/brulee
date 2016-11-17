'use strict';

angular.module('bruleeApp')

  .controller('GroceryListCtrl', function ($scope, $stateParams, GroceryList) {

    $scope.errors = [];

    $scope.selectGroceryList = function (id) {
      return GroceryList
        .find(id)
        .then((data) => {
          $scope.groceryList = data;
        })
        .catch((error) => {
          $scope.errors.push(error);
        });
    };

    $scope.init = function () {
      // TODO: Default to most recent week if no id is supplied
      if ($stateParams.id) {
        $scope.selectGroceryList($stateParams.id);
      }
    };

    $scope.init();

    $scope.setError = (error) => {
      $scope.errors = [error];
    };

  });
