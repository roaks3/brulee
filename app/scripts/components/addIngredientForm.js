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

    vm.updateIngredient = (ingredient) => {
      vm.ingredient = ingredient;
    };

  });

angular.module('bruleeApp')
  .component('addIngredientForm', {
    bindings: {
      onAdd: '&'
    },
    controller: 'AddIngredientFormCtrl as vm',
    templateUrl: 'views/addIngredientForm.html'
  });
