'use strict';

angular.module('bruleeApp.services')

  .service('categoryService', function ($q, Category) {

    this.size = function () {
      return Category.filter().length;
    };

    this.getByIngredientId = function (ingredientId) {
      return _.head(Category.filter({
        where: {
          ingredient_ids: {
            contains: ingredientId
          }
        }
      }));
    };

    this.updateAll = function (categories) {
      return $q.all(
        _.map(categories, function (category) {
          return Category.update(category.id, {
            name: category.name,
            order: category.order,
            ingredient_ids: category.ingredient_ids
          });
        })
      );
    };

    return this;

  });
