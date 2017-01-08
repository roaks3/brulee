'use strict';

class GroceryListPageCtrl {

  constructor ($stateParams, GroceryList, groceryListPageStore) {
    this.$stateParams = $stateParams;
    this.GroceryList = GroceryList;
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
    let groceryList = null;
    return this.GroceryList
      .find(id)
      .then(data => {
        groceryList = data;
        return this.groceryListPageStore.fetchAllRecipesForGroceryList(groceryList);
      })
      .then(() => {
        this.groceryList = groceryList;
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
