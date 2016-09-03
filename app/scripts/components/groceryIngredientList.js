'use strict';

angular.module('bruleeApp')
  .controller('GroceryIngredientListCtrl', function () {

    var vm = this;

    vm.crossOut = function (ingredient) {
      if (vm.crossedOut(ingredient)) {
        _.remove(vm.crossedOutIngredients, function (crossedOutIngredient) {
          return crossedOutIngredient === ingredient.id;
        });
      } else {
        vm.crossedOutIngredients.push(ingredient.id);
      }
    };

    vm.crossedOut = function (ingredient) {
      return _.includes(vm.crossedOutIngredients, ingredient.id);
    };

  });

angular.module('bruleeApp')
  .component('groceryIngredientList', {
    bindings: {
      groceryIngredients: '=',
      crossedOutIngredients: '='
    },
    controller: 'GroceryIngredientListCtrl as vm',
    templateUrl: 'views/groceryIngredientList.html'
  });
