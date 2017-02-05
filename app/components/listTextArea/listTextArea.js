'use strict';

class ListTextAreaCtrl {

  $onInit () {
    this.numLines = this.rawText.split('\n').length;
  }

  updateLines () {
    this.numLines = this.rawText.split('\n').length;
  }

}

angular.module('bruleeApp')
  .component('listTextArea', {
    bindings: {
      rawText: '='
    },
    controller: ListTextAreaCtrl,
    templateUrl: 'components/listTextArea/listTextArea.html'
  });
