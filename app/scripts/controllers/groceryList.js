'use strict';

angular.module('bruleeApp')

  .controller('GroceryListCtrl', function ($filter, $scope, $routeParams, $sessionStorage, $timeout, categoryService, groceryListService) {

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

    $sessionStorage.crossedOutIngredients = $sessionStorage.crossedOutIngredients || [];
    $scope.crossedOutIngredients = $sessionStorage.crossedOutIngredients;

    $scope.groceryList = {};
    $scope.selectGroceryList = function (id) {
      $scope.groceryList = _.find($scope.groceryLists, ['id', id]);
      if ($scope.groceryList) {
        $scope.groceryList.groceryIngredients = $filter('groceryListFilter')($scope.groceryList);
      } else {
        $scope.groceryList = {};
      }
    };

    $scope.addIngredient = function (ingredient) {
      $scope.groceryList.additional_ingredients = $scope.groceryList.additional_ingredients || [];
      $scope.groceryList.additional_ingredients.push({
        ingredient: ingredient,
        amount: 1
      });

      groceryListService.update($scope.groceryList)
        .then(function () {
          // TODO: Can probably come up with a less naive solution
          $scope.refreshGroceryLists();
        });
    };

  });
