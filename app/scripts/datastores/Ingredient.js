import angular from 'angular';
import jsData from 'js-data-angular';

import bruleeDataService from '../services/bruleeDataService';

export default angular.module('services.Ingredient', [jsData, bruleeDataService])

  .factory('Ingredient', function (bruleeDataService, DS) {
    'ngInject';

    return DS.defineResource(_.assign({
      name: 'ingredient',
      endpoint: 'ingredients'
    }, bruleeDataService.jsDataConfig));

  })
  .name;
