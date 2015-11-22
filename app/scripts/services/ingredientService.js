'use strict';

angular.module('bruleeApp.services')

  .service('ingredientService', function (bruleeDataService) {

    var index = 'ashlea2';
    var type = 'ingredient';

    this.ingredients = function() {
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

    this.ingredientCreate = function (ingredient) {
      return bruleeDataService.create({
        index: index,
        type: type,
        body: ingredient
      })
        .then(function (data) {
          return data._id;
        });
    };

    this.ingredientUpdate = function (ingredient) {
      return bruleeDataService.update({
        index: index,
        type: type,
        id: ingredient.id,
        body: {
          doc: {
            name: ingredient.name
          }
        }
      });
    };

    this.ingredientDelete = function (ingredientId) {
      return bruleeDataService.delete({
        index: index,
        type: type,
        id: ingredientId
      });
    };

    return this;

  });
