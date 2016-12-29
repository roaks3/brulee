'use strict';

class CategoryEditListItemCtrl {

  constructor ($window, categoryPageStore) {
    this.$window = $window;
    this.categoryPageStore = categoryPageStore;
  }

  $onInit () {
    this.ingredients = this.categoryPageStore.getIngredientsForCategory(this.category.id);
  }

  $onChanges (changesObj) {
    if (changesObj.category) {
      this.ingredients = this.categoryPageStore.getIngredientsForCategory(this.category.id);
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

}

angular.module('bruleeApp')
  .component('categoryEditListItem', {
    bindings: {
      category: '<',
      onRemove: '&'
    },
    controller: CategoryEditListItemCtrl,
    controllerAs: 'vm',
    templateUrl: 'views/categoryEditListItem.html'
  });
