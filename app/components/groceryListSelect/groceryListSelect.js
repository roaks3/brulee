import moment from 'moment';
import angular from 'angular';

import GroceryList from '../../scripts/datastores/GroceryList';

import template from './groceryListSelect.html';
import './groceryListSelect.scss';

class GroceryListSelectCtrl {

  constructor (GroceryList) {
    'ngInject';

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

export default angular.module('components.groceryListSelect', [GroceryList])
  .component('groceryListSelect', {
    template,
    bindings: {
      selectedGroceryListId: '<'
    },
    controller: GroceryListSelectCtrl,
    controllerAs: 'vm'
  })
  .name;
