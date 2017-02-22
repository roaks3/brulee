import angular from 'angular';

import categoryPageStore from '../../scripts/services/categoryPageStore';
import addIngredientForm from '../addIngredientForm/addIngredientForm';
import ingredientEditList from '../ingredientEditList/ingredientEditList';

import template from './categoryEditListItem.html';
import './categoryEditListItem.scss';

class CategoryEditListItemCtrl {

  constructor ($window, categoryPageStore) {
    'ngInject';

    this.$window = $window;
    this.categoryPageStore = categoryPageStore;
  }

  $onInit () {
    this.ingredients = this.categoryPageStore.selectIngredientsForCategory(this.category.id);
    this.isEditing = false;
  }

  $onChanges (changesObj) {
    if (changesObj.category) {
      this.ingredients = this.categoryPageStore.selectIngredientsForCategory(this.category.id);
    }
  }

  addIngredient (ingredient) {
    if (!this.$window.confirm(`Add '${ingredient.name}' to '${this.category.name}'?`)) {
      return;
    }

    if (!_.find(this.category.ingredient_ids, ingredient.id)) {
      this.categoryPageStore.addIngredientToCategory(ingredient.id, this.category.id);
    } else {
      this.$window.alert('This ingredient already exists in this category');
    }
  }

  removeIngredient (ingredient) {
    if (!this.$window.confirm(`Remove '${ingredient.name}' from '${this.category.name}'?`)) {
      return;
    }
    this.categoryPageStore.removeIngredientFromCategory(ingredient.id, this.category.id);
  }

  toggleEditing () {
    this.isEditing = true;
  }

}

export default angular
  .module('components.categoryEditListItem', [
    categoryPageStore,
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
