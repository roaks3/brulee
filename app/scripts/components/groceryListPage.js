'use strict';

class GroceryListPageCtrl {

  constructor ($stateParams, GroceryList) {
    this.$stateParams = $stateParams;
    this.GroceryList = GroceryList;
    this.errors = [];
  }

  $onInit () {
    // TODO: Default to most recent week if no id is supplied
    if (this.$stateParams.id) {
      this.selectGroceryList(this.$stateParams.id);
    }
  }

  selectGroceryList (id) {
    return this.GroceryList
      .find(id)
      .then(data => {
        this.groceryList = data;
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
