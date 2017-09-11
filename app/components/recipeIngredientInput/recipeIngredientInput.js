import angular from 'angular';

import Ingredient from '../../scripts/datastores/Ingredient';
import categoryService from '../../scripts/services/categoryService';
import ingredientTypeahead from '../ingredientTypeahead/ingredientTypeahead';
import categorySelect from '../categorySelect/categorySelect';

import template from './recipeIngredientInput.html';

class RecipeIngredientInputCtrl {

  constructor (categoryService, Ingredient) {
    'ngInject';

    this.categoryService = categoryService;
    this.Ingredient = Ingredient;
  }

  $onInit () {
    this.Ingredient
      .find(this.recipeIngredient.ingredient_id)
      .then((ingredient) => {
        this.ingredient = ingredient;
        this.category = this.categoryService.getByIngredientId(ingredient.id);
      });
  }

  changeIngredient (ingredient) {
    this.ingredient = ingredient;
    this.category = this.categoryService.getByIngredientId(ingredient.id);
    this.onIngredientChange({ingredientId: this.ingredient.id});
  }

}

export default angular
  .module('components.recipeIngredientInput', [
    Ingredient,
    categoryService,
    ingredientTypeahead,
    categorySelect
  ])
  .component('recipeIngredientInput', {
    template,
    bindings: {
      recipeIngredient: '<',
      onRemove: '&',
      onIngredientChange: '&',
      onAmountChange: '&',
      onUnitChange: '&',
      inputDisabled: '<'
    },
    controller: RecipeIngredientInputCtrl,
    controllerAs: 'vm'
  })
  .name;
