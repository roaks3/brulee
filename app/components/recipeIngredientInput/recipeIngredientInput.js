import angular from 'angular';

import Category from '../../scripts/datastores/Category';
import Ingredient from '../../scripts/datastores/Ingredient';
import ingredientTypeahead from '../ingredientTypeahead/ingredientTypeahead';
import categorySelect from '../categorySelect/categorySelect';

import template from './recipeIngredientInput.html';

class RecipeIngredientInputCtrl {

  constructor (Category, Ingredient) {
    'ngInject';

    this.Category = Category;
    this.Ingredient = Ingredient;
  }

  $onInit () {
    this.Ingredient
      .find(this.recipeIngredient.ingredient_id)
      .then((ingredient) => {
        this.ingredient = ingredient;
        this.category = this.Category.get(ingredient.category_id || '');
      });
  }

  changeIngredient (ingredient) {
    this.ingredient = ingredient;
    this.category = this.Category.get(ingredient.category_id || '');
    this.onIngredientChange({ingredientId: this.ingredient.id});
  }

}

export default angular
  .module('components.recipeIngredientInput', [
    Category,
    Ingredient,
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
