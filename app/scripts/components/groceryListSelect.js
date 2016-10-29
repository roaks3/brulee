'use strict';

class GroceryListSelectCtrl {

  constructor (GroceryList) {
    this.GroceryList = GroceryList;
    this.groceryLists = [];
  }

  $onInit () {
    this.GroceryList
      .refreshAll()
      .then((data) => {
        this.groceryLists = _.sortBy(data, 'week_start');
      });
  }

}

angular.module('bruleeApp')
  .component('groceryListSelect', {
    controller: GroceryListSelectCtrl,
    controllerAs: 'vm',
    templateUrl: 'views/groceryListSelect.html'
  });
