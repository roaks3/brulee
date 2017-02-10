'use strict';

class GroceryCategoryListCtrl {
}

angular.module('bruleeApp')
  .component('groceryCategoryList', {
    bindings: {
      categories: '<',
      crossedOutIngredients: '<',
      onCrossOut: '&'
    },
    controller: GroceryCategoryListCtrl,
    templateUrl: 'components/groceryCategoryList/groceryCategoryList.html'
  });
