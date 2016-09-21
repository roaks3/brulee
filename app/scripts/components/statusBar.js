'use strict';

angular.module('bruleeApp')
  .component('statusBar', {
    bindings: {
      errors: '<',
      successMessage: '<'
    },
    templateUrl: 'views/statusBar.html'
  });
