import angular from 'angular';
import jsData from 'js-data-angular';

export default angular.module('services.Category', [jsData])

  .factory('Category', function (DS) {
    'ngInject';

    return DS.defineResource({
      name: 'category',
      endpoint: 'categories'
    });

  })
  .name;
