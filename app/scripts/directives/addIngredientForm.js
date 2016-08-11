'use strict';

angular.module('bruleeApp')
  .controller('AddIngredientFormCtrl', function () {

    var vm = this;

    vm.isNewIngredient = function () {
      return !(vm.ingredient && vm.ingredient.id);
    };

    vm.addIngredient = function () {
      if (vm.isNewIngredient()) {
        // TODO: Show some sort of error because ingredient could not be added
      } else {
        vm.onAdd({ingredient: vm.ingredient});
      }
    };

  });

angular.module('bruleeApp')
  .directive('addIngredientForm', function () {
    return {
      scope: {},
      bindToController: {
        onAdd: '&'
      },
      controller: 'AddIngredientFormCtrl',
      controllerAs: 'vm',
      templateUrl: 'views/addIngredientForm.html'
    };
  });
