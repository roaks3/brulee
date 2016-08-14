
'use strict';

angular.module('bruleeApp')

  .controller('CreateListCtrl', function ($filter, $q, $scope, $sessionStorage,
                                          Category, GroceryList, Ingredient,
                                          Recipe) {

    $scope.recipes = [];
    $scope.init = function () {
      $scope.errors = [];
      $scope.successMessage = null;

      return Recipe
        .refreshAll()
        .then((data) => {
          $scope.recipes = data;
        })
        .then(() => Ingredient.refreshAll())
        .then(() => Category.refreshAll())
        .catch((error) => {
          $scope.errors.push(error);
        });
    };

    $scope.init();

    $sessionStorage.crossedOutIngredients = $sessionStorage.crossedOutIngredients || [];
    $scope.crossedOutIngredients = $sessionStorage.crossedOutIngredients;

    $scope.shoppingList = [];

    $scope.calculateShoppingList = function () {
      var selectedRecipes = _($scope.recipes)
        .filter('_selected')
        .value();

      $scope.newGroceryList = {
        week_start: moment().day(0).format('MM/DD'),
        recipe_days: _.map(selectedRecipes, function (recipe) {
          return {
            recipe_id: recipe.id
          };
        })
      };

      $scope.shoppingList = $filter('groceryListFilter')($scope.newGroceryList);
    };

    $scope.saveGroceryList = function () {
      if ($scope.newGroceryList.id) {
        //GroceryList.update($scope.newGroceryList);
      } else {
        GroceryList.create({
          week_start: $scope.newGroceryList.week_start,
          recipe_days: _.map($scope.newGroceryList.recipe_days, function (recipeDay) {
            return {
              recipe_id: recipeDay.recipe_id,
              day_of_week: recipeDay.day_of_week ? parseInt(recipeDay.day_of_week) : null
            };
          })
        });
      }
    };
  });
