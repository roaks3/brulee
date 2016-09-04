'use strict';

class IngredientTypeaheadCtrl {

  constructor (Ingredient) {
    this.Ingredient = Ingredient;
    this.ingredients = [];
    this._selectedIngredient = {};
  }

  $onInit () {
    this._selectedIngredient = _.cloneDeep(this.selectedIngredient);
    this.Ingredient
      .refreshAll()
      .then((data) => {
        this.ingredients = data;
      });
  }

  $onChanges (changesObj) {
    if (changesObj.selectedIngredient) {
      this._selectedIngredient = _.cloneDeep(changesObj.selectedIngredient.currentValue);
    }
  }

  onChange (ingredient) {
    if (_.isString(ingredient)) {
      this._selectedIngredient = {name: ingredient};
    }
    this.onSelect({ingredient: this._selectedIngredient});
  }

}

angular.module('bruleeApp')
  .component('ingredientTypeahead', {
    bindings: {
      inputDisabled: '<',
      selectedIngredient: '<',
      onSelect: '&'
    },
    controller: IngredientTypeaheadCtrl,
    controllerAs: 'vm',
    templateUrl: 'views/ingredientTypeahead.html'
  });
