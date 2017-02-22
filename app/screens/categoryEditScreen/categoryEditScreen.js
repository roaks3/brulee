import angular from 'angular';

import categoryPageStore from '../../scripts/services/categoryPageStore';
import statusBar from '../../components/statusBar/statusBar';
import categoryEditListItem from '../../components/categoryEditListItem/categoryEditListItem';

import template from './categoryEditScreen.html';
import './categoryEditScreen.scss';

class CategoryEditScreenCtrl {

  constructor ($q, $window, categoryPageStore) {
    'ngInject';

    this.$q = $q;
    this.$window = $window;
    this.categoryPageStore = categoryPageStore;
    this.categories = [];
    this.errors = [];
    this.successMessage = null;
  }

  $onInit () {
    this.$q
      .all([
        this.categoryPageStore.fetchAllCategories(),
        this.categoryPageStore.fetchAllIngredients()
      ])
      .then(() => {
        this.categories = this.categoryPageStore.categories;
      })
      .catch(error => {
        this.errors.push(error);
      });
  }

  saveCategories () {
    this.errors = [];
    this.successMessage = null;

    this.categoryPageStore
      .saveAllCategories()
      .then(() => {
        this.successMessage = 'Saved all categories';
      })
      .catch(error => {
        this.errors.push(error);
      });
  }

  addCategory (categoryName) {
    if (!this.$window.confirm(`Add a new category named '${categoryName}'?`)) {
      return;
    }

    this.errors = [];
    this.successMessage = null;

    this.categoryPageStore
      .createCategory(categoryName)
      .then(() => {
        this.categories = this.categoryPageStore.categories;
        this.successMessage = 'Created category';
      })
      .catch(error => {
        this.errors.push(error);
      });
  }

  removeCategory (categoryId) {
    if (!this.$window.confirm('Remove this category?')) {
      return;
    }

    this.errors = [];
    this.successMessage = null;

    this.categoryPageStore
      .destroyCategory(categoryId)
      .then(() => {
        this.categories = this.categoryPageStore.categories;
        this.successMessage = 'Deleted category';
      })
      .catch(error => {
        this.errors.push(error);
      });
  }

}

export default angular
  .module('screens.categoryEditScreen', [
    categoryPageStore,
    statusBar,
    categoryEditListItem
  ])
  .component('categoryEditScreen', {
    template,
    controller: CategoryEditScreenCtrl,
    controllerAs: 'vm'
  })
  .name;
