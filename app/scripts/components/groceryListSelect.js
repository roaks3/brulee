'use strict';

class GroceryListSelectCtrl {

  constructor (GroceryList) {
    this.GroceryList = GroceryList;
    this.groceryLists = [];
  }

  $onInit () {
    this.GroceryList
      .refreshAll()
      .then(groceryLists => {
        this.groceryLists = _.takeRight(_.sortBy(groceryLists, 'week_start'), 4);
        this.selectedGroceryList =
          this.selectedGroceryListId && this.GroceryList.get(this.selectedGroceryListId);
      });
  }

  openOptions () {
    this.showOptions = true;
  }

  displayName (groceryList) {
    if (!groceryList || !groceryList.week_start) {
      return 'Unknown';
    }

    let weekStartMoment = moment(groceryList.week_start, 'YYYY-MM-DD');
    let weeksAgo = moment().diff(weekStartMoment, 'weeks');

    if (weeksAgo === 0) {
      return 'This Week';
    } else if (weeksAgo === 1) {
      return 'Last Week';
    } else {
      return weeksAgo + ' Weeks Ago';
    }
  }

  isSelected (groceryList) {
    return this.selectedGroceryListId === groceryList.id;
  }

}

angular.module('bruleeApp')
  .component('groceryListSelect', {
    bindings: {
      selectedGroceryListId: '<'
    },
    controller: GroceryListSelectCtrl,
    controllerAs: 'vm',
    templateUrl: 'views/groceryListSelect.html'
  });
