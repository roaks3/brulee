import angular from 'angular';

import template from './listTextArea.html';
import './listTextArea.scss';

class ListTextAreaCtrl {

  $onInit () {
    this.numLines = (this.rawText || '').split('\n').length;
  }

  updateLines () {
    this.numLines = (this.rawText || '').split('\n').length;
  }

}

export default angular.module('components.listTextArea', [])
  .component('listTextArea', {
    template,
    bindings: {
      rawText: '='
    },
    controller: ListTextAreaCtrl
  })
  .name;
