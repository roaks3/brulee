'use strict';

class GroceryListScreenCtrl {

  constructor ($stateParams, groceryListPageStore) {
    this.$stateParams = $stateParams;
    this.groceryListPageStore = groceryListPageStore;
    this.errors = [];
  }

  $onInit () {
    // TODO: Default to most recent week if no id is supplied
    if (this.$stateParams.id) {
      this.selectGroceryList(this.$stateParams.id);
    }
  }

  selectGroceryList (id) {
    return this.groceryListPageStore
      .fetchGroceryList(id)
      .then(() => this.groceryListPageStore.fetchAllRecipesForGroceryList())
      .then(() => this.groceryListPageStore.fetchAllIngredientsForGroceryList())
      .then(() => this.groceryListPageStore.fetchAllCategories())
      .then(() => {
        this.groceryList = this.groceryListPageStore.selectedGroceryList;
      })
      .catch(error => {
        this.errors.push(error);
      });
  }

  addIngredient (ingredient) {
    this.groceryList = null;
    this.groceryListPageStore
      .addIngredientToGroceryList(ingredient)
      .then(() => {
        this.groceryList = this.groceryListPageStore.selectedGroceryList;
      });
  }

  setError (error) {
    this.errors = [error];
  }

}

angular.module('bruleeApp')
  .component('groceryListScreen', {
    controller: GroceryListScreenCtrl,
    controllerAs: 'vm',
    templateUrl: 'screens/groceryListScreen/groceryListScreen.html'
  });
