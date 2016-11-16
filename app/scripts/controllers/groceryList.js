'use strict';

angular.module('bruleeApp')

  .controller('GroceryListCtrl', function ($scope, $stateParams, $localStorage,
                                           GroceryList, groceryIngredientService) {

    $scope.groceryList = {};
    $scope.errors = [];

    $localStorage.crossedOutIngredients = $localStorage.crossedOutIngredients || [];
    $scope.crossedOutIngredients = $localStorage.crossedOutIngredients;

    $scope.selectGroceryList = function (id) {
      return GroceryList
        .find(id)
        .then((data) => {
          $scope.groceryList = data;
          return groceryIngredientService
            .generate($scope.groceryList)
            .then((data) => {
              $scope.groceryIngredients = data;
            });
        })
        .catch((error) => {
          $scope.errors.push(error);
          $scope.groceryList = {};
          $scope.groceryIngredients = {};
        });
    };

    $scope.init = function () {
      if ($stateParams.id) {
        $scope.selectGroceryList($stateParams.id);
      }
    };

    $scope.init();

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
        });
    };

    $scope.crossOut = function (ingredient) {
      if (_.includes($scope.crossedOutIngredients, ingredient.id)) {
        _.pull($scope.crossedOutIngredients, ingredient.id);
      } else {
        $scope.crossedOutIngredients.push(ingredient.id);
      }
    };

    $scope.clearCrossedOutIngredients = function () {
      $localStorage.crossedOutIngredients = [];
      $scope.crossedOutIngredients = $localStorage.crossedOutIngredients;
    };

  });
