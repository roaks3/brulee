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
      return bruleeDataService.create({
        index: 'ashlea',
        type: 'recipe',
        body: recipe
      });
    };

    return this;

  });
