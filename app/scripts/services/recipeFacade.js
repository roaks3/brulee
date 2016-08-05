'use strict';

angular.module('bruleeApp.services')

  .factory('Recipe', function (bruleeDataService, DS) {

    return DS.defineResource(_.assign({
      name: 'recipe',
      endpoint: 'recipes'
    }, bruleeDataService.jsDataConfig));

  })

  .service('recipeFacade', function (Recipe) {

    this.recipes = function () {
      return Recipe.findAll();
    };

    this.recipeCreate = function (recipe) {
      return Recipe.create({
        name: recipe.name,
        original_text: recipe.original_text,
        url: recipe.url,
        recipe_ingredients: recipe.recipe_ingredients
      });
    };

    this.recipeUpdate = function (recipe) {
      return Recipe.update(recipe.id, {
        name: recipe.name,
        original_text: recipe.original_text,
        url: recipe.url,
        recipe_ingredients: recipe.recipe_ingredients
      });
    };

    this.recipeDelete = function (recipeId) {
      return Recipe.destroy(recipeId);
    };

    return this;

  });
