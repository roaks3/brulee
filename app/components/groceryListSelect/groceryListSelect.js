import moment from 'moment';
import angular from 'angular';

import groceryListStore from '../../store/groceryListStore';

import template from './groceryListSelect.html';
import './groceryListSelect.scss';

class GroceryListSelectCtrl {

  constructor (groceryListStore) {
    'ngInject';

    this.groceryListStore = groceryListStore;
    this.groceryLists = [];
  }

  $onInit () {
    this.groceryListStore
      .fetchRecentGroceryLists(4)
      .then(() => {
        this.groceryLists = this.groceryListStore.selectRecentGroceryLists(4);
        if (this.selectedGroceryListId) {
          this.selectedGroceryList =
            this.groceryListStore.selectGroceryListById(this.selectedGroceryListId);
        } else {
          // By default, select the most recent grocery list
          this.onSelect({groceryList: this.groceryLists[this.groceryLists.length - 1]});
        }
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

export default angular.module('components.groceryListSelect', [groceryListStore])
  .component('groceryListSelect', {
    template,
    bindings: {
      selectedGroceryListId: '<',
      onSelect: '&'
    },
    controller: GroceryListSelectCtrl,
    controllerAs: 'vm'
  })
  .name;
