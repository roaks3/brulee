import angular from 'angular';
import jsData from 'js-data-angular';

import bruleeDataService from '../services/bruleeDataService';

export default angular.module('services.GroceryList', [jsData, bruleeDataService])

  .factory('GroceryList', function (bruleeDataService, DS) {
    'ngInject';

    return DS.defineResource(_.assign({
      name: 'groceryList',
      endpoint: 'groceryLists'
    }, bruleeDataService.jsDataConfig));

  })
  .name;
