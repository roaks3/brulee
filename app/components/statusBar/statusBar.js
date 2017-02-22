import angular from 'angular';

import template from './statusBar.html';
import './statusBar.scss';

export default angular.module('components.statusBar', [])
  .component('statusBar', {
    template,
    bindings: {
      errors: '<',
      successMessage: '<'
    }
  })
  .name;
