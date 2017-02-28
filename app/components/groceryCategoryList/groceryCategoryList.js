import angular from 'angular';

import groceryCategoryListItem from '../groceryCategoryListItem/groceryCategoryListItem';

import template from './groceryCategoryList.html';

class GroceryCategoryListCtrl {
}

export default angular.module('components.groceryCategoryList', [groceryCategoryListItem])
  .component('groceryCategoryList', {
    template,
    bindings: {
      categories: '<',
      crossedOutIngredients: '<',
      groceryList: '<',
      onCrossOut: '&'
    },
    controller: GroceryCategoryListCtrl
  })
  .name;
