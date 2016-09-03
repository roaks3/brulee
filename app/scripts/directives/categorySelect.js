'use strict';

angular.module('bruleeApp')
  .controller('CategorySelectCtrl', function (Category) {

    var vm = this;

    vm.categories = [];

    Category.refreshAll()
      .then(function (data) {
        vm.categories = data;
      });

    vm.displayName = function (category) {
      return category ? category.name : 'None';
    };

    vm.selectCategory = function (category) {
      vm.selectedCategory = category;
    };

  });

angular.module('bruleeApp')
  .component('categorySelect', {
    bindings: {
      inputDisabled: '=',
      selectedCategory: '='
    },
    controller: 'CategorySelectCtrl as vm',
    templateUrl: 'views/categorySelect.html'
  });
