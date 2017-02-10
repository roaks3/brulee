'use strict';

angular.module('bruleeApp')
  .component('statusBar', {
    bindings: {
      errors: '<',
      successMessage: '<'
    },
    templateUrl: 'components/statusBar/statusBar.html'
  });
