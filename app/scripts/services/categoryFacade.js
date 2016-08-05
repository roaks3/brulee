'use strict';

angular.module('bruleeApp.services')

  .factory('Category', function (bruleeDataService, DS) {

    return DS.defineResource(_.assign({
      name: 'category',
      endpoint: 'categories'
    }, bruleeDataService.jsDataConfig));

  })

  .service('categoryFacade', function ($q, Category) {

    this.categories = function () {
      return Category.findAll();
    };

    this.categoryCreate = function (category) {
      return Category.create({
        name: category.name,
        order: category.order
      });
    };

    this.categoryUpdate = function (category) {
      return Category.update(category.id, {
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
      return Category.destroy(categoryId);
    };

    return this;

  });
