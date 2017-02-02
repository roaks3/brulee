'use strict';

class RecipeListScreenCtrl {

  constructor ($window, Recipe) {
    this.$window = $window;
    this.Recipe = Recipe;
    this.recipes = [];
    this.filteredRecipes = [];
    this.errors = [];
  }

  $onInit () {
    this.recipeSearch = { str: this.$window.sessionStorage.getItem('recipeFilterQuery') || '' };

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
    this.$window.sessionStorage.setItem('recipeFilterQuery', this.recipeSearch.str);
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
