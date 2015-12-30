'use strict';

angular.module('bruleeApp')
  .controller('CategorySelectCtrl', function (categoryService) {

    var vm = this;

    vm.categories = [];

    categoryService.findAll()
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
  .directive('categorySelect', function () {
    return {
      scope: {},
      bindToController: {
        inputDisabled: '=',
        selectedCategory: '='
      },
      controller: 'CategorySelectCtrl',
      controllerAs: 'vm',
      templateUrl: 'views/categorySelect.html'
    };
  });
