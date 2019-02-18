import angular from 'angular';
import jsData from 'js-data-angular';

export default angular.module('services.Recipe', [jsData])

  .factory('Recipe', function (DS) {
    'ngInject';

    return DS.defineResource({
      name: 'recipe',
      endpoint: 'recipes'
    });

  })
  .name;
