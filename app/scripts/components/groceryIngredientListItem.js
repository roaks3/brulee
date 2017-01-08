'use strict';

class GroceryIngredientListItemCtrl {

  constructor (groceryListPageStore) {
    this.groceryListPageStore = groceryListPageStore;
    this.recipes = [];
  }

  $onInit () {
    this.recipes = this.groceryListPageStore.selectRecipesForIngredient(this.ingredient.id);
  }

  toggle () {
    this.isExpanded = !this.isExpanded;
  }

}

angular.module('bruleeApp')
  .component('groceryIngredientListItem', {
    bindings: {
      ingredient: '<',
      isCrossedOut: '<',
      onCrossOut: '&'
    },
    controller: GroceryIngredientListItemCtrl,
    templateUrl: 'views/groceryIngredientListItem.html'
  });
