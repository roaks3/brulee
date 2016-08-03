'use strict';

angular.module('bruleeApp.services')

  .service('categoryFacade', function ($q, bruleeDataService) {

    this.categories = function () {
      return bruleeDataService.search('categories');
    };

    this.categoryCreate = function (category) {
      var categoryFields = {
        name: category.name,
        order: category.order
      };
      return bruleeDataService.create('categories', categoryFields);
    };

    this.categoryUpdate = function (category) {
      return bruleeDataService.update('categories', {
        ingredient_ids: category.ingredient_ids
      });
    };

    this.categoryUpdateBulk = function (categories) {
      var scope = this;
      return $q.all(
        _.map(categories, function (category) {
          return scope.categoryUpdate(category);
        })
      );
    };

    this.categoryDelete = function (categoryId) {
      return bruleeDataService.delete('categories', categoryId);
    };

    return this;

  });
