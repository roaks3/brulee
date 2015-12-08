'use strict';

angular.module('bruleeApp.services')

  .service('recipesService', function ($q, bruleeDataService) {

    this.recipes = function () {
      return bruleeDataService.search({
        index: 'ashlea2',
        type: 'recipe',
        size: 500,
        body: {
          query: {
            match_all: {}
          }
        }
      })
        .then(function (data) {
          return _.map(data.hits.hits, function (hit) {
            return _.assign(hit._source, {
              id: hit._id
            });
          });
        });
    };

    this.recipeCreate = function (recipe) {
      var recipeFields = {
        name: recipe.name,
        original_text: recipe.originalText,
        recipe_ingredients: _.map(recipe.recipe_ingredients, function (recipe_ingredient) {
          return {
            ingredient_id: recipe_ingredient.ingredient.id,
            amount: recipe_ingredient.amount
          };
        })
      };

      return bruleeDataService.create({
        index: 'ashlea2',
        type: 'recipe',
        body: recipeFields
      });
    };

    return this;

  });
