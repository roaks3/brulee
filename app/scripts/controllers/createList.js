
'use strict';

angular.module('bruleeApp')

  .controller('CreateListCtrl', function ($scope, GroceryList, groceryListPageStore) {

    $scope.recipes = [];
    $scope.errors = [];
    $scope.successMessage = null;

    $scope.init = function () {
      return groceryListPageStore
        .fetchRecipeUseCounts()
        .then(() => groceryListPageStore.fetchAllRecipes())
        .then(() => groceryListPageStore.fetchAllCategories())
        .then(() => {
          $scope.recipeUseCountsByRecipeId = groceryListPageStore.recipeUseCountsByRecipeId;
          $scope.recipes = groceryListPageStore.recipes;
        })
        .catch(error => {
          $scope.errors.push(error);
        });
    };

    $scope.init();

    $scope.calculateShoppingList = function () {
      var selectedRecipes = _($scope.recipes)
        .filter('_selected')
        .value();

      $scope.newGroceryList = {
        week_start: moment().day(0).format('YYYY-MM-DD'),
        recipe_days: _.map(selectedRecipes, function (recipe) {
          return {
            recipe_id: recipe.id,
            day_of_week: 0
          };
        })
      };

      groceryListPageStore.setSelectedGroceryList($scope.newGroceryList);
      groceryListPageStore
        .fetchAllRecipesForGroceryList()
        .then(() => groceryListPageStore.fetchAllIngredientsForGroceryList())
        .then(() => {
          $scope.categories = groceryListPageStore.selectCategoriesForIngredients();
        });
    };

    $scope.saveGroceryList = function () {
      $scope.errors = [];
      $scope.successMessage = null;

      if ($scope.newGroceryList.id) {
        //GroceryList.update($scope.newGroceryList);
        $scope.errors.push('Cannot update the grocery list in this view');
      } else {
        GroceryList
          .create({
            week_start: $scope.newGroceryList.week_start,
            recipe_days: _.map($scope.newGroceryList.recipe_days, function (recipeDay) {
              return _.pick(recipeDay, ['recipe_id', 'day_of_week']);
            })
          })
          .then(() => {
            $scope.successMessage = 'Grocery list saved';
          })
          .catch((error) => {
            $scope.errors.push(error);
          });
      }
    };

    $scope.updateDayOfWeek = (recipeDay, day) => {
      recipeDay.day_of_week = day;
    };

  });
