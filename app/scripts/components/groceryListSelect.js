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
        this.groceryLists = _.takeRight(_.sortBy(data, 'week_start'), 4);
      });
  }

  displayName (groceryList) {
    if (!groceryList || !groceryList.week_start) {
      return '';
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

}

angular.module('bruleeApp')
  .component('groceryListSelect', {
    controller: GroceryListSelectCtrl,
    controllerAs: 'vm',
    templateUrl: 'views/groceryListSelect.html'
  });
