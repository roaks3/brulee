'use strict';

angular.module('bruleeApp')
  .controller('IngredientTypeaheadCtrl', function (ingredientService) {

    var vm = this;

    vm.ingredients = [];

    ingredientService.findAll()
      .then(function (data) {
        vm.ingredients = data;
      });

  });

angular.module('bruleeApp')
  .directive('ingredientTypeahead', function () {
    return {
      scope: {},
      bindToController: {
        inputDisabled: '=',
        selectedIngredient: '='
      },
      controller: 'IngredientTypeaheadCtrl',
      controllerAs: 'vm',
      templateUrl: 'views/ingredientTypeahead.html'
    };
  });
