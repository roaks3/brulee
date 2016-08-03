'use strict';

angular.module('bruleeApp.services')

  .service('ingredientFacade', function (bruleeDataService) {

    this.ingredients = function () {
      return bruleeDataService.search('ingredients');
    };

    this.ingredientCreate = function (ingredient) {
      var ingredientFields = {
        name: ingredient.name
      };
      return bruleeDataService.create('ingredients', ingredientFields);
    };

    this.ingredientUpdate = function (ingredient) {
      return bruleeDataService.update('ingredients', {
        name: ingredient.name
      });
    };

    this.ingredientDelete = function (ingredientId) {
      return bruleeDataService.delete('ingredients', ingredientId);
    };

    return this;

  });
