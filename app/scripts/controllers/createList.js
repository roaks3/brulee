
'use strict';

angular.module('bruleeApp')

  .controller('CreateListCtrl', function ($q, $scope, GroceryList,
                                          groceryIngredientService, Recipe) {

    $scope.recipes = [];
    $scope.groceryIngredients = [];
    $scope.errors = [];
    $scope.successMessage = null;

    $scope.init = function () {
      return Recipe
        .refreshAll()
        .then((data) => {
          $scope.recipes = data;
        })
        .then(() => GroceryList.refreshAll())
        .then(() => {
          $scope.recipes = _.reverse(_.sortBy($scope.recipes, $scope.numUsed));
        })
        .catch((error) => {
          $scope.errors.push(error);
        });
    };

    $scope.init();

    $scope.calculateShoppingList = function () {
      var selectedRecipes = _($scope.recipes)
        .filter('_selected')
        .value();

      $scope.newGroceryList = {
        week_start: moment().day(0).format('MM/DD'),
        recipe_days: _.map(selectedRecipes, function (recipe) {
          return {
            recipe_id: recipe.id,
            day_of_week: 0
          };
        })
      };

      groceryIngredientService
        .generate($scope.newGroceryList)
        .then((data) => {
          $scope.groceryIngredients = data;
        });
    };

    $scope.saveGroceryList = function () {
      if ($scope.newGroceryList.id) {
        //GroceryList.update($scope.newGroceryList);
      } else {
        GroceryList
          .create({
            week_start: $scope.newGroceryList.week_start,
            recipe_days: _.map($scope.newGroceryList.recipe_days, function (recipeDay) {
              return {
                recipe_id: recipeDay.recipe_id,
                day_of_week: recipeDay.day_of_week
              };
            })
          });
      }
    };

    $scope.numUsed = (recipe) => {
      return _(GroceryList.filter())
        .filter((groceryList) => {
          return _.some(groceryList.recipe_days, ['recipe_id', recipe.id]);
        })
        .size();
    };

    $scope.updateDayOfWeek = (recipeDay, day) => {
      recipeDay.day_of_week = day;
    };

  });
