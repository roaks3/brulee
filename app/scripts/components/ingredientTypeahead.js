'use strict';

class IngredientTypeaheadCtrl {

  constructor (Ingredient) {
    this.Ingredient = Ingredient;
    this.ingredients = [];
  }

  $onInit () {
    this.Ingredient
      .refreshAll()
      .then((data) => {
        this.ingredients = data;
      });
  }

  onChange (ingredient) {
    if (_.isString(ingredient)) {
      this.selectedIngredient = {name: ingredient};
    }
    this.onSelect({ingredient: this.selectedIngredient});
  }

}

angular.module('bruleeApp')
  .component('ingredientTypeahead', {
    bindings: {
      inputDisabled: '=',
      selectedIngredient: '=',
      onSelect: '&'
    },
    controller: IngredientTypeaheadCtrl,
    controllerAs: 'vm',
    templateUrl: 'views/ingredientTypeahead.html'
  });
