'use strict';

class GroceryIngredientPanelCtrl {

  constructor (groceryListPageStore) {
    this.groceryListPageStore = groceryListPageStore;
  }

  $onInit () {
    this.groceryListPageStore.fetchCrossedOutIngredients();
    this.crossedOutIngredients = this.groceryListPageStore.crossedOutIngredientIds;

    this.categories = this.groceryListPageStore.selectCategoriesForIngredients();
  }

  openAddIngredient () {
    this.showAddIngredient = true;
  }

  crossOut (ingredient) {
    this.groceryListPageStore.toggleCrossedOutIngredient(ingredient.id);
    this.crossedOutIngredients = this.groceryListPageStore.crossedOutIngredientIds;
  }

  clearCrossedOutIngredients () {
    this.groceryListPageStore.clearCrossedOutIngredients();
    this.crossedOutIngredients = this.groceryListPageStore.crossedOutIngredientIds;
  }

}

angular.module('bruleeApp')
  .component('groceryIngredientPanel', {
    bindings: {
      groceryList: '<',
      onAddIngredient: '&',
      onError: '&'
    },
    controller: GroceryIngredientPanelCtrl,
    templateUrl: 'views/groceryIngredientPanel.html'
  });
