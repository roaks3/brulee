'use strict';

class CategorySelectCtrl {

  constructor (Category) {
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

angular.module('bruleeApp')
  .component('categorySelect', {
    bindings: {
      inputDisabled: '<',
      selectedCategory: '<',
      onCategoryChange: '&'
    },
    controller: CategorySelectCtrl,
    controllerAs: 'vm',
    templateUrl: 'views/categorySelect.html'
  });
