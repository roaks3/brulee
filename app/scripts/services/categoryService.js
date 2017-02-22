import angular from 'angular';

import Category from '../datastores/Category';

export default angular.module('services.categoryService', [Category])

  .service('categoryService', function ($q, Category) {
    'ngInject';

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
          return Category.update(category.id, _.pick(category, ['name', 'order', 'ingredient_ids']));
        })
      );
    };

    return this;

  })
  .name;
