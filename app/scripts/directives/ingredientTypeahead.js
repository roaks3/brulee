'use strict';

angular.module('bruleeApp')
  .controller('IngredientTypeaheadCtrl', function (ingredientService) {

    var vm = this;

    vm.ingredients = [];

    ingredientService.findAll()
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
  .directive('ingredientTypeahead', function () {
    return {
      scope: {},
      bindToController: {
        inputDisabled: '=',
        selectedIngredient: '=',
        onSelect: '&'
      },
      controller: 'IngredientTypeaheadCtrl',
      controllerAs: 'vm',
      templateUrl: 'views/ingredientTypeahead.html'
    };
  });
