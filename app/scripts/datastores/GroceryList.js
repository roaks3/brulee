'use strict';

angular.module('bruleeApp.services')

  .factory('GroceryList', function (bruleeDataService, DS) {

    return DS.defineResource(_.assign({
      name: 'groceryList',
      endpoint: 'groceryLists'
    }, bruleeDataService.jsDataConfig));

  });
