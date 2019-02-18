import angular from 'angular';
import jsData from 'js-data-angular';

export default angular.module('services.Ingredient', [jsData])

  .factory('Ingredient', function (DS) {
    'ngInject';

    return DS.defineResource({
      name: 'ingredient',
      endpoint: 'ingredients'
    });

  })
  .name;
