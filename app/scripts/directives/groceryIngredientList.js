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
  .directive('groceryIngredientList', function () {
    return {
      scope: {},
      bindToController: {
        groceryIngredients: '=',
        crossedOutIngredients: '='
      },
      controller: 'GroceryIngredientListCtrl',
      controllerAs: 'vm',
      templateUrl: 'views/groceryIngredientList.html'
    };
  });
