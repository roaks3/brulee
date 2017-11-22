import angular from 'angular';

import categoryStore from '../../store/categoryStore';
import ingredientStore from '../../store/ingredientStore';

class CategoryEditScreenStore {

  constructor ($q, categoryStore, ingredientStore) {
    'ngInject';

    this.$q = $q;
    this.categoryStore = categoryStore;
    this.ingredientStore = ingredientStore;
    this.categories = [];
  }

  fetchAllCategories () {
    return this.categoryStore
      .fetchAllCategories()
      .then(() => {
        this.categories = this.categoryStore.selectAllCategories();
      });
  }

  fetchAllIngredients () {
    return this.ingredientStore.fetchAllIngredients();
  }

  createCategory (categoryName) {
    return this.categoryStore
      .createCategory({
        name: categoryName,
        order: this.categories.length + 1,
        ingredient_ids: []
      })
      .then(() => {
        this.categories = this.categoryStore.selectAllCategories();
      });
  }

  destroyCategory (categoryId) {
    return this.categoryStore
      .destroyCategory(categoryId)
      .then(() => {
        this.categories = this.categoryStore.selectAllCategories();
      });
  }

  addIngredientToCategory (ingredientId, categoryId) {
    const categoryIndex = this.categories.findIndex(c => c.id === categoryId);
    const category = Object.assign({}, this.categories[categoryIndex], {
      ingredient_ids: [...this.categories[categoryIndex].ingredient_ids, ingredientId]
    });
    const removeFromCategories = this.categories.filter(c => c.ingredient_ids.includes(ingredientId));

    return this.$q
      .all(
        removeFromCategories.map(removeFromCategory => {
          return this.removeIngredientFromCategory(ingredientId, removeFromCategory.id);
        })
      )
      .then(() => this.categoryStore.updateCategory(category))
      .then(() => {
        this.categories = this.categoryStore.selectAllCategories();
      });
  }

  removeIngredientFromCategory (ingredientId, categoryId) {
    const categoryIndex = this.categories.findIndex(c => c.id === categoryId);
    const category = Object.assign({}, this.categories[categoryIndex], {
      ingredient_ids: this.categories[categoryIndex].ingredient_ids.filter(id => id !== ingredientId)
    });

    return this.categoryStore
      .updateCategory(category)
      .then(() => {
        this.categories = this.categoryStore.selectAllCategories();
      });
  }

  selectIngredientsForCategory (categoryId) {
    const category = this.categories.find(category => category.id === categoryId);
    return _.sortBy(
      this.ingredientStore.selectAllIngredients().filter(ingredient => category.ingredient_ids.includes(ingredient.id)),
      'name'
    );
  }

  selectIngredientsForCategoryBySearchTerm (categoryId, searchTerm) {
    const ingredients = this.selectIngredientsForCategory(categoryId);
    return ingredients.filter(ingredient => {
      return !searchTerm || (ingredient.name && ingredient.name.toLowerCase().includes(searchTerm.toLowerCase()));
    });
  }

}

export default angular
  .module('services.categoryEditScreenStore', [
    categoryStore,
    ingredientStore
  ])
  .service('categoryEditScreenStore', CategoryEditScreenStore)
  .name;
