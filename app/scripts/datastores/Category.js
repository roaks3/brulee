'use strict';

angular.module('bruleeApp.services')

  .factory('Category', function (bruleeDataService, DS) {

    return DS.defineResource(_.assign({
      name: 'category',
      endpoint: 'categories'
    }, bruleeDataService.jsDataConfig));

  });
