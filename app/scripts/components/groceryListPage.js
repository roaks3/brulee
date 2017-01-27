'use strict';

class GroceryListPageCtrl {

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
      .then(() => {
        this.groceryList = this.groceryListPageStore.selectedGroceryList;
      })
      .catch(error => {
        this.errors.push(error);
      });
  }

  setError (error) {
    this.errors = [error];
  }

}

angular.module('bruleeApp')
  .component('groceryListPage', {
    controller: GroceryListPageCtrl,
    controllerAs: 'vm',
    templateUrl: 'views/groceryListPage.html'
  });
