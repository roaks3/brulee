'use strict';

angular.module('bruleeApp.services')

  .service('recipesService', function ($q, bruleeDataService) {

    this.recipes = function () {
      return bruleeDataService.search({
        index: 'ashlea',
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
            var recipe = new Recipe(
              hit._source.name,
              null,
              hit._source.originalText
            );

            _.each(hit._source.ingredients, function (ingredient) {
              recipe.addIngredient(
                new Ingredient(
                  ingredient.item,
                  ingredient.amount
                )
              );
            });

            return recipe;
          });
        });
    };

    this.recipeCreate = function (recipe) {
      return bruleeDataService.create({
        index: 'ashlea',
        type: 'recipe',
        body: recipe
      });
    };

    return this;

  });
