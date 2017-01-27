'use strict';

class GroceryCategoryListCtrl {
}

angular.module('bruleeApp')
  .component('groceryCategoryList', {
    bindings: {
      groceryIngredients: '<',
      crossedOutIngredients: '<',
      onCrossOut: '&'
    },
    controller: GroceryCategoryListCtrl,
    templateUrl: 'views/groceryCategoryList.html'
  });
