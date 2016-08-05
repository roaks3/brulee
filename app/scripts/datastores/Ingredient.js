'use strict';

angular.module('bruleeApp.services')

  .factory('Ingredient', function (bruleeDataService, DS) {

    return DS.defineResource(_.assign({
      name: 'ingredient',
      endpoint: 'ingredients'
    }, bruleeDataService.jsDataConfig));

  });
