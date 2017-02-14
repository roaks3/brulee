'use strict';

class RecipeStore {

  constructor (Recipe) {
    this.Recipe = Recipe;
  }

  fetchAllRecipes () {
    return this.Recipe
      .findAll()
      .then(recipes => {
        this.allRecipes = recipes;
      });
  }

  selectRecipesBySearchTerm (searchTerm, ingredientIds) {
    return this.allRecipes.filter(recipe => {
      return (recipe.name && recipe.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (recipe.tags && recipe.tags.includes(searchTerm.toLowerCase())) ||
        (recipe.recipe_ingredients && recipe.recipe_ingredients.some(ri => ingredientIds.includes(ri.ingredient_id)));
    });
  }

}

angular.module('bruleeApp.services')
  .service('recipeStore', RecipeStore);
