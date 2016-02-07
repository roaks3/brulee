'use strict';

angular.module('bruleeApp')

  .controller('RecipeListCtrl', ($sessionStorage, $scope, recipeService) => {

    $sessionStorage.recipeSearch = $sessionStorage.recipeSearch || {str: ''};
    $scope.recipeSearch = $sessionStorage.recipeSearch;

    $scope.errors = [];
    $scope.successMessage = null;

    $scope.recipes = [];
    recipeService.findAll()
      .then((data) => {
        $scope.recipes = data;
        $scope.filterRecipes();
      })
      .catch((error) => {
        $scope.errors.push(error);
      });

    $scope.filteredRecipes = [];
    $scope.filterRecipes = () => {
      $scope.filteredRecipes = oldlodash.filter($scope.recipes, (recipe) => {
        return recipe.name && recipe.name.toLowerCase().indexOf($scope.recipeSearch.str.toLowerCase()) !== -1;
      });
    };

  });
