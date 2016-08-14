'use strict';

angular.module('bruleeApp')

  .controller('GroceryListCtrl', function ($filter, $scope, $routeParams,
                                           $sessionStorage, Category, GroceryList,
                                           Ingredient, Recipe) {

    $scope.init = function () {
      $scope.errors = [];
      $scope.successMessage = null;

      return Category
        .refreshAll()
        .then(() => Recipe.refreshAll())
        .then(() => Ingredient.refreshAll())
        .then(() => $scope.refreshGroceryLists())
        .catch((error) => {
          $scope.errors.push(error);
        });
    };

    $scope.groceryLists = [];
    $scope.refreshGroceryLists = function () {
      $scope.errors = [];
      $scope.successMessage = null;

      $scope.groceryLists = [];
      return GroceryList.refreshAll()
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

    $scope.init();

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
        ingredient_id: ingredient.id,
        amount: 1
      });

      GroceryList.update($scope.groceryList.id, {
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
