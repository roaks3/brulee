import angular from 'angular';

import Recipe from '../datastores/Recipe';

export default angular.module('services.recipeService', [Recipe])

  .service('recipeService', function (Recipe) {
    'ngInject';

    this.filterByIngredientId = function (ingredientId) {
      return _.filter(Recipe.filter(), (recipe) => {
        return _.includes(_.map(recipe.recipe_ingredients, 'ingredient_id'), ingredientId);
      });
    };

    return this;

  })
  .name;
