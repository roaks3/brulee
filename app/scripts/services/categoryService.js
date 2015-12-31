'use strict';

angular.module('bruleeApp.services')

  .service('categoryService', function ($q, bruleeUtils, categoryFacade, ingredientService) {

    this.deferredCategories = null;

    this._categories = [];
    this._categoriesById = {};

    this.size = function () {
      return this._categories.length;
    };

    this.ejectAll = function () {
      this._categories = [];
      this._categoriesById = {};
      this.deferredCategories = null;
    };

    this.refreshAll = function () {
      this.deferredCategories = $q.defer();
      var scope = this;

      $q.all([
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

    this.getByName = function (name) {
      return _.find(this._categories, 'name', name);
    };

    this.getByIngredientId = function (ingredientId) {
      return _.find(this._categories, function (category) {
        return _.includes(_.pluck(category.ingredients, 'id'), ingredientId);
      });
    };

    this.inject = function (category) {
      var existingCategory = _.find(this._categories, 'id', category.id);
      if (existingCategory) {
        bruleeUtils.replaceProperties(existingCategory, category);
      } else {
        this._categories.push(category);
        this._categoriesById[category.id] = category;
      }
    };

    this.create = function (attrs) {
      var category = {
        name: attrs.name,
        order: attrs.order
      };
      var scope = this;

      return categoryFacade.categoryCreate(category)
        .then(function (id) {
          category.id = id;
          category.ingredients = [];
          scope.inject(category);
          return category;
        });
    };

    this.update = function (category) {
      var categoryUpdate = {
        id: category.id,
        ingredient_ids: _(category.ingredients).pluck('id').uniq().value()
      };

      return categoryFacade.categoryUpdate(categoryUpdate)
        .then(this.inject(category));
    };

    this.updateAll = function (categories) {
      var categoryUpdates = _.map(categories, function (category) {
        return {
          id: category.id,
          ingredient_ids: _(category.ingredients).pluck('id').uniq().value()
        };
      });
      var scope = this;

      return categoryFacade.categoryUpdateBulk(categoryUpdates)
        .then(function () {
          return $q.all(_.map(categories, function (category) {
            return scope.inject(category);
          }));
        });
    };

    this.eject = function (id) {
      _.remove(this._categories, 'id', id);
      delete this._categoriesById[id];
    };

    this.destroy = function (id) {
      return categoryFacade.categoryDelete(id)
        .then(this.eject(id));
    };

    return this;

  });
