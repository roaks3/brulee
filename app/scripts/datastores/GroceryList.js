import angular from 'angular';
import jsData from 'js-data-angular';

export default angular.module('services.GroceryList', [jsData])

  .factory('GroceryList', function (DS) {
    'ngInject';

    return DS.defineResource({
      name: 'groceryList',
      endpoint: 'groceryLists'
    });

  })
  .name;
