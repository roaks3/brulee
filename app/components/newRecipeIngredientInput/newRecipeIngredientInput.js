import angular from 'angular';

import Category from '../../scripts/datastores/Category';
import ingredientTypeahead from '../ingredientTypeahead/ingredientTypeahead';
import categorySelect from '../categorySelect/categorySelect';

import template from './newRecipeIngredientInput.html';

class NewRecipeIngredientInputCtrl {

  constructor (Category) {
    'ngInject';

    this.Category = Category;
  }

  isNewIngredient () {
    return !this.ingredient.id;
  }

  changeIngredient (ingredient) {
    this.onIngredientChange({ingredient: ingredient});
    this.onCategoryChange({category: this.Category.get(ingredient.category_id || '')});
  }

}

export default angular
  .module('components.newRecipeIngredientInput', [
    Category,
    ingredientTypeahead,
    categorySelect
  ])
  .component('newRecipeIngredientInput', {
    template,
    bindings: {
      ingredient: '<',
      amount: '<',
      unit: '<',
      category: '<',
      onRemove: '&',
      onIngredientChange: '&',
      onAmountChange: '&',
      onUnitChange: '&',
      onCategoryChange: '&'
    },
    controller: NewRecipeIngredientInputCtrl,
    controllerAs: 'vm'
  })
  .name;
