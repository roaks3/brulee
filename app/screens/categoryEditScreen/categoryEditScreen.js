import angular from 'angular';

import categoryEditScreenStore from '../../store/categoryEditScreenStore';
import statusBar from '../../components/statusBar/statusBar';
import categoryEditListItem from '../../components/categoryEditListItem/categoryEditListItem';

import template from './categoryEditScreen.html';
import './categoryEditScreen.scss';

class CategoryEditScreenCtrl {

  constructor ($q, $window, categoryEditScreenStore) {
    'ngInject';

    this.$q = $q;
    this.$window = $window;
    this.categoryEditScreenStore = categoryEditScreenStore;
    this.categories = [];
    this.errors = [];
    this.successMessage = null;
  }

  $onInit () {
    this.categoryEditScreenStore
      .fetchAll()
      .then(() => {
        this.categories = this.categoryEditScreenStore.selectCategories();
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

    this.categoryEditScreenStore
      .createCategory(categoryName)
      .then(() => {
        this.categories = this.categoryEditScreenStore.selectCategories();
        this.successMessage = 'Created category';
      })
      .catch(error => {
        this.errors.push(error);
      });
  }

  updateCategory () {
    this.categories = this.categoryEditScreenStore.selectCategories().map(category => Object.assign({}, category));
  }

  removeCategory (categoryId) {
    if (!this.$window.confirm('Remove this category?')) {
      return;
    }

    this.errors = [];
    this.successMessage = null;

    this.categoryEditScreenStore
      .destroyCategory(categoryId)
      .then(() => {
        this.categories = this.categoryEditScreenStore.selectCategories();
        this.successMessage = 'Deleted category';
      })
      .catch(error => {
        this.errors.push(error);
      });
  }

}

export default angular
  .module('screens.categoryEditScreen', [
    categoryEditScreenStore,
    statusBar,
    categoryEditListItem
  ])
  .component('categoryEditScreen', {
    template,
    controller: CategoryEditScreenCtrl,
    controllerAs: 'vm'
  })
  .name;
