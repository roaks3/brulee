'use strict';

angular.module('bruleeApp')

  .controller('GroceryListCtrl', function ($scope, $routeParams, $sessionStorage,
                                           GroceryList, groceryIngredientService) {

    $scope.groceryLists = [];
    $scope.groceryList = {};
    $scope.errors = [];

    $sessionStorage.crossedOutIngredients = $sessionStorage.crossedOutIngredients || [];
    $scope.crossedOutIngredients = $sessionStorage.crossedOutIngredients;

    $scope.init = function () {
      return $scope
        .refreshGroceryLists()
        .catch((error) => {
          $scope.errors.push(error);
        });
    };

    $scope.refreshGroceryLists = function () {
      $scope.errors = [];
      $scope.groceryLists = [];

      return GroceryList
        .refreshAll()
        .then(function (data) {
          $scope.groceryLists = _.sortBy(data, 'week_start');

          if ($routeParams.id) {
            $scope.selectGroceryList($routeParams.id);
          }
        })
        .catch(function (error) {
          $scope.errors.push(error);
        });
    };

    $scope.init();

    $scope.selectGroceryList = function (id) {
      $scope.groceryList = _.find($scope.groceryLists, ['id', id]);
      if ($scope.groceryList) {
        groceryIngredientService
          .generate($scope.groceryList)
          .then((data) => {
            $scope.groceryIngredients = data;
          });
      } else {
        $scope.groceryList = {};
        $scope.groceryIngredients = {};
      }
    };

    $scope.addIngredient = function (ingredient) {
      $scope.groceryList.additional_ingredients = $scope.groceryList.additional_ingredients || [];
      $scope.groceryList.additional_ingredients.push({
        ingredient_id: ingredient.id,
        amount: 1
      });

      GroceryList
        .update($scope.groceryList.id, {
          week_start: $scope.groceryList.week_start,
          recipe_days: $scope.groceryList.recipe_days,
          additional_ingredients: $scope.groceryList.additional_ingredients
        })
        .then(function () {
          // TODO: Can probably come up with a less naive solution
          $scope.refreshGroceryLists();
        });
    };

  });
