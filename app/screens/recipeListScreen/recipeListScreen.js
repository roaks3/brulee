'use strict';

class RecipeListScreenCtrl {

  constructor ($sessionStorage, Recipe) {
    this.Recipe = Recipe;
    this.recipes = [];
    this.filteredRecipes = [];
    this.errors = [];

    $sessionStorage.recipeSearch = $sessionStorage.recipeSearch || {str: ''};
    this.recipeSearch = $sessionStorage.recipeSearch;
  }

  $onInit () {
    this.Recipe.refreshAll()
      .then(data => {
        this.recipes = data;
        this.filterRecipes();
      })
      .catch(error => {
        this.errors.push(error);
      });
  }

  filterRecipes () {
    this.filteredRecipes = this.recipes.filter(recipe => {
      return recipe.name && recipe.name.toLowerCase().indexOf(this.recipeSearch.str.toLowerCase()) !== -1;
    });
  }

}

angular.module('bruleeApp')
  .component('recipeListScreen', {
    controller: RecipeListScreenCtrl,
    controllerAs: 'vm',
    templateUrl: 'screens/recipeListScreen/recipeListScreen.html'
  });
