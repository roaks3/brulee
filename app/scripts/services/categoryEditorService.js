'use strict';

angular.module('bruleeApp.services')

  .service('categoryEditorService', function ($q, bruleeUtils, categoryFacade, ingredientService) {

    this.deferredCategories = null;

    this._categories = [];
    this._categoriesById = {};

    this.ejectAll = function () {
      this._categories = [];
      this._categoriesById = {};
      this.deferredCategories = null;
    };

    this.refreshAll = function () {
      this.deferredCategories = $q.defer();
      var scope = this;

      return $q.all([
        categoryFacade.categories(),
        ingredientService.findAll()
      ])
        .then(function (data) {
          var categories = _.map(data[0], function (category) {
            return _.assign(category, {
              ingredients: _.map(category.ingredient_ids, function (ingredientId) {
                return ingredientService.get(ingredientId);
              })
            });
          });

          bruleeUtils.replaceEach(scope._categories, categories);
          bruleeUtils.replaceProperties(scope._categoriesById, _.indexBy(scope._categories, 'id'));

          scope.deferredCategories.resolve();
        })
        .catch(function (error) {
          scope.deferredCategories.reject(error);
        });

      return this.deferredCategories.promise;
    };

    this.findAll = function () {
      var categoriesPromise = this.deferredCategories ? this.deferredCategories.promise : this.refreshAll();
      var scope = this;

      return categoriesPromise
        .then(function () {
          return scope._categories;
        });
    };

    this.get = function (id) {
      return this._categoriesById[id];
    };

    this.categoryUpdateBulk = function (categories) {
      var categoryUpdates = _.map(categories, function (category) {
        return {
          id: category.id,
          ingredient_ids: _(category.ingredients).pluck('id').uniq().value()
        };
      });

      return categoryFacade.categoryUpdateBulk(categoryUpdates);
    };

    this.categoryCreate = function (categoryName, order) {
      var category = {
        name: categoryName,
        order: order
      };

      return categoryFacade.categoryCreate(category)
        .then(function (id) {
          category.id = id;
          category.ingredients = [];
          return category;
        });
    };

    this.categoryDelete = function (categoryId) {
      return categoryFacade.categoryDelete(categoryId);
    };

    return this;

  });
