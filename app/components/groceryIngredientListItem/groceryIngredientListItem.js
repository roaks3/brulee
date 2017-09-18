import angular from 'angular';

import selectedGroceryListStore from '../../store/selectedGroceryListStore';

import template from './groceryIngredientListItem.html';
import './groceryIngredientListItem.scss';

class GroceryIngredientListItemCtrl {

  constructor (selectedGroceryListStore) {
    'ngInject';

    this.selectedGroceryListStore = selectedGroceryListStore;
    this.recipes = [];
  }

  $onChanges (changesObj) {
    if (changesObj.groceryList) {
      this.recipes = this.selectedGroceryListStore
        .selectRecipesForIngredient(this.ingredient.id);
    }
  }

  toggle () {
    this.isExpanded = !this.isExpanded;
  }

  recipeAmount (recipe) {
    const recipeIngredient = recipe.recipe_ingredients.find(ri => ri.ingredient_id === this.ingredient.id);
    return recipeIngredient.amount + (recipeIngredient.unit ? ' ' + recipeIngredient.unit : '');
  }

}

export default angular.module('components.groceryIngredientListItem', [selectedGroceryListStore])
  .component('groceryIngredientListItem', {
    template,
    bindings: {
      ingredient: '<',
      groceryList: '<',
      isCrossedOut: '<',
      onCrossOut: '&'
    },
    controller: GroceryIngredientListItemCtrl
  })
  .name;
