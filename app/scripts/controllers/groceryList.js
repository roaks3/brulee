'use strict';

angular.module('bruleeApp')

  .controller('GroceryListCtrl', function ($filter, $scope, $routeParams, $timeout, categoryService, groceryListService) {

    $scope.categories = [];
    $scope.refreshCategories = function () {
      $scope.errors = [];
      $scope.successMessage = null;

      $scope.categories = [];
      return categoryService.findAll()
        .then(function (data) {
          $scope.categories = data;
        })
        .catch(function (error) {
          $scope.errors.push(error);
        });
    };

    $scope.groceryLists = [];
    $scope.refreshGroceryLists = function () {
      $scope.errors = [];
      $scope.successMessage = null;

      $scope.groceryLists = [];
      return groceryListService.findAll()
        .then(function (data) {
          $scope.groceryLists = data;

          if ($routeParams.id) {
            $scope.selectGroceryList($routeParams.id);
          }
        })
        .catch(function (error) {
          $scope.errors.push(error);
        });
    };

    $scope.refreshCategories();

    $timeout(function () {
      $scope.refreshGroceryLists();
    }, 500);

    $scope.groceryList = {};
    $scope.selectGroceryList = function (id) {
      $scope.groceryList = _.find($scope.groceryLists, 'id', id);
      if ($scope.groceryList) {
        $scope.groceryList.groceryIngredients = $filter('groceryListFilter')($scope.groceryList);
      } else {
        $scope.groceryList = {};
      }
    };

  });
