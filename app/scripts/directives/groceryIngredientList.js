'use strict';

angular.module('bruleeApp')
  .controller('GroceryIngredientListCtrl', function (categoryService) {

    var vm = this;

  });

angular.module('bruleeApp')
  .directive('groceryIngredientList', function () {
    return {
      scope: {},
      bindToController: {
        groceryIngredients: '='
      },
      controller: 'GroceryIngredientListCtrl',
      controllerAs: 'vm',
      templateUrl: 'views/groceryIngredientList.html'
    };
  });
