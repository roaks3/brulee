import angular from 'angular';

import Category from '../datastores/Category';

export default angular.module('services.categoryService', [Category])

  .service('categoryService', function (Category) {
    'ngInject';

    this.get = function (categoryId) {
      if (!categoryId) {
        return null;
      }
      return Category.get(categoryId);
    };

    return this;

  })
  .name;
