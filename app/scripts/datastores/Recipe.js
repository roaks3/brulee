import angular from 'angular';
import jsData from 'js-data-angular';

import bruleeDataService from '../services/bruleeDataService';

export default angular.module('services.Recipe', [jsData, bruleeDataService])

  .factory('Recipe', function (bruleeDataService, DS) {
    'ngInject';

    return DS.defineResource(_.assign({
      name: 'recipe',
      endpoint: 'recipes'
    }, bruleeDataService.jsDataConfig));

  })
  .name;
