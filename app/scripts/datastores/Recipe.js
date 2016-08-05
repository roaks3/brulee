'use strict';

angular.module('bruleeApp.services')

  .factory('Recipe', function (bruleeDataService, DS) {

    return DS.defineResource(_.assign({
      name: 'recipe',
      endpoint: 'recipes'
    }, bruleeDataService.jsDataConfig));

  });
