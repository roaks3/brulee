'use strict';

angular.module('bruleeApp.services')

  .service('recipeFacade', function ($q, bruleeDataService) {

    var index = 'ashlea2';
    var type = 'recipe';

    this.recipes = function () {
      return bruleeDataService.search({
        index: index,
        type: type,
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
        original_text: recipe.original_text,
        url: recipe.url,
        recipe_ingredients: recipe.recipe_ingredients
      };

      return bruleeDataService.create({
        index: index,
        type: type,
        body: recipeFields
      })
        .then(function (data) {
          return data._id;
        });
    };

    return this;

  });
