'use strict';

angular.module('bruleeApp.services')

  .service('recipeFacade', function (bruleeDataService) {

    this.recipes = function () {
      return bruleeDataService.search('recipes');
    };

    this.recipeCreate = function (recipe) {
      var recipeFields = {
        name: recipe.name,
        original_text: recipe.original_text,
        url: recipe.url,
        recipe_ingredients: recipe.recipe_ingredients
      };
      return bruleeDataService.create('recipes', recipeFields);
    };

    this.recipeUpdate = function (recipe) {
      return bruleeDataService.update('recipes', {
        name: recipe.name,
        url: recipe.url
      });
    };

    this.recipeDelete = function (recipeId) {
      return bruleeDataService.delete('recipes', recipeId);
    };

    return this;

  });
