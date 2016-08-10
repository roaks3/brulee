'use strict';

angular.module('bruleeApp.services')

  .service('categoryService', function ($q, bruleeUtils, Category, Ingredient) {

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
        Category.findAll(),
        Ingredient.findAll()
      ])
        .then(function (data) {
          var categories = _.map(data[0], function (category) {
            return _.assign(category, {
              ingredients: _.map(category.ingredient_ids, function (ingredientId) {
                return Ingredient.get(ingredientId);
              })
            });
          });

          bruleeUtils.replaceEach(scope._categories, categories);
          bruleeUtils.replaceProperties(scope._categoriesById, _.keyBy(scope._categories, 'id'));

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
      return _.find(this._categories, ['name', name]);
    };

    this.getByIngredientId = function (ingredientId) {
      return _.find(this._categories, function (category) {
        return _.includes(_.map(category.ingredients, 'id'), ingredientId);
      });
    };

    this.inject = function (category) {
      var existingCategory = _.find(this._categories, ['id', category.id]);
      if (existingCategory) {
        var updatedCategory = _.clone(category);
        _.defaults(updatedCategory, existingCategory);
        bruleeUtils.replaceProperties(existingCategory, updatedCategory);
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

      return Category.create(category)
        .then(function (category) {
          category.ingredients = [];
          scope.inject(category);
          return category;
        });
    };

    this.update = function (category) {
      var categoryUpdate = {
        name: category.name,
        order: category.order,
        ingredient_ids: _(category.ingredients).map('id').uniq().value()
      };

      return Category.update(category.id, categoryUpdate)
        .then(this.inject(category));
    };

    this.updateAll = function (categories) {
      var scope = this;
      return $q.all(
        _.map(categories, function (category) {
          return scope.update(category);
        })
      );
    };

    this.eject = function (id) {
      _.remove(this._categories, ['id', id]);
      delete this._categoriesById[id];
    };

    this.destroy = function (id) {
      return Category.destroy(id)
        .then(this.eject(id));
    };

    return this;

  });
