'use strict';

angular.module('bruleeApp')
  .controller('IngredientTypeaheadCtrl', function (Ingredient) {

    var vm = this;

    vm.ingredients = [];

    Ingredient.refreshAll()
      .then(function (data) {
        vm.ingredients = data;
      });

    vm.onChange = function (ingredient) {
      if (_.isString(ingredient)) {
        vm.selectedIngredient = {name: ingredient};
      }
      vm.onSelect({ingredient: vm.selectedIngredient});
    };

  });

angular.module('bruleeApp')
  .component('ingredientTypeahead', {
    bindings: {
      inputDisabled: '=',
      selectedIngredient: '=',
      onSelect: '&'
    },
    controller: 'IngredientTypeaheadCtrl as vm',
    templateUrl: 'views/ingredientTypeahead.html'
  });
