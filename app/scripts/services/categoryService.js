import angular from 'angular';

import Category from '../datastores/Category';

export default angular.module('services.categoryService', [Category])

  .service('categoryService', function (Category) {
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

    return this;

  })
  .name;
