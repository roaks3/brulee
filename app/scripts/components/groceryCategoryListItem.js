'use strict';

class GroceryCategoryListItemCtrl {

  constructor (groceryListPageStore) {
    this.groceryListPageStore = groceryListPageStore;
  }

  $onInit () {
    this.ingredients = this.groceryListPageStore.selectIngredientsForCategory(this.category.id);
  }

}

angular.module('bruleeApp')
  .component('groceryCategoryListItem', {
    bindings: {
      category: '<',
      crossedOutIngredients: '<',
      onCrossOut: '&'
    },
    controller: GroceryCategoryListItemCtrl,
    templateUrl: 'views/groceryCategoryListItem.html'
  });
