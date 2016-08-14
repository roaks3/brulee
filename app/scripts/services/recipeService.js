'use strict';

angular.module('bruleeApp.services')

  .service('recipeService', function (Recipe) {

    this.filterByIngredientId = function (ingredientId) {
      return _.filter(Recipe.filter(), (recipe) => {
        return _.includes(_.map(recipe.recipe_ingredients, 'ingredient_id'), ingredientId);
      });
    };

    return this;

  });
