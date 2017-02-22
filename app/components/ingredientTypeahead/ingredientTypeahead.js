import angular from 'angular';
import uiBootstrap from 'angular-ui-bootstrap';

import Ingredient from '../../scripts/datastores/Ingredient';

import template from './ingredientTypeahead.html';

class IngredientTypeaheadCtrl {

  constructor (Ingredient) {
    'ngInject';

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

  isValid () {
    return this._selectedIngredient && this._selectedIngredient.id;
  }

}

export default angular.module('components.ingredientTypeahead', [uiBootstrap, Ingredient])
  .component('ingredientTypeahead', {
    template,
    bindings: {
      inputDisabled: '<',
      selectedIngredient: '<',
      onSelect: '&'
    },
    controller: IngredientTypeaheadCtrl
  })
  .name;
