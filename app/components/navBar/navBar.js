import angular from 'angular';

import template from './navBar.html';
import './navBar.scss';

export default angular.module('components.navBar', [])
  .component('navBar', {
    template
  })
  .name;
