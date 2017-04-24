import angular from 'angular';

import categoryEditScreenStore from '../../scripts/services/categoryEditScreenStore';
import addIngredientForm from '../addIngredientForm/addIngredientForm';
import ingredientEditList from '../ingredientEditList/ingredientEditList';

import template from './categoryEditListItem.html';
import './categoryEditListItem.scss';

class CategoryEditListItemCtrl {

  constructor ($window, categoryEditScreenStore) {
    'ngInject';

    this.$window = $window;
    this.categoryEditScreenStore = categoryEditScreenStore;
  }

  $onInit () {
    this.ingredients = this.categoryEditScreenStore.selectIngredientsForCategory(this.category.id);
    this.isEditing = false;
  }

  $onChanges (changesObj) {
    if (changesObj.category) {
      this.ingredients = this.categoryEditScreenStore.selectIngredientsForCategory(this.category.id);
    }
  }

  addIngredient (ingredient) {
    if (!this.$window.confirm(`Add '${ingredient.name}' to '${this.category.name}'?`)) {
      return;
    }

    if (!_.find(this.category.ingredient_ids, ingredient.id)) {
      this.categoryEditScreenStore.addIngredientToCategory(ingredient.id, this.category.id);
    } else {
      this.$window.alert('This ingredient already exists in this category');
    }
  }

  removeIngredient (ingredient) {
    if (!this.$window.confirm(`Remove '${ingredient.name}' from '${this.category.name}'?`)) {
      return;
    }
    this.categoryEditScreenStore.removeIngredientFromCategory(ingredient.id, this.category.id);
  }

  toggleEditing () {
    this.isEditing = true;
  }

}

export default angular
  .module('components.categoryEditListItem', [
    categoryEditScreenStore,
    addIngredientForm,
    ingredientEditList
  ])
  .component('categoryEditListItem', {
    template,
    bindings: {
      category: '<',
      onRemove: '&'
    },
    controller: CategoryEditListItemCtrl,
    controllerAs: 'vm'
  })
  .name;
