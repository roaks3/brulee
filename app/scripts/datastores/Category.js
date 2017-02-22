import angular from 'angular';
import jsData from 'js-data-angular';

import bruleeDataService from '../services/bruleeDataService';

export default angular.module('services.Category', [jsData, bruleeDataService])

  .factory('Category', function (bruleeDataService, DS) {
    'ngInject';

    return DS.defineResource(_.assign({
      name: 'category',
      endpoint: 'categories'
    }, bruleeDataService.jsDataConfig));

  })
  .name;
