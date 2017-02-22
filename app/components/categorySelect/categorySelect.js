import angular from 'angular';
import uiBootstrap from 'angular-ui-bootstrap';

import Category from '../../scripts/datastores/Category';

import template from './categorySelect.html';

class CategorySelectCtrl {

  constructor (Category) {
    'ngInject';

    this.Category = Category;
    this.categories = [];
  }

  $onInit () {
    this.Category
      .refreshAll()
      .then((data) => {
        this.categories = data;
      });
  }

  displayName (category) {
    return category ? category.name : 'None';
  }

}

export default angular.module('components.categorySelect', [uiBootstrap, Category])
  .component('categorySelect', {
    template,
    bindings: {
      inputDisabled: '<',
      selectedCategory: '<',
      onCategoryChange: '&'
    },
    controller: CategorySelectCtrl,
    controllerAs: 'vm'
  })
  .name;
