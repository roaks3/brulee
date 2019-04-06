import angular from 'angular';

import categoryStore from './categoryStore';
import ingredientStore from './ingredientStore';

class CategoryEditScreenStore {

  constructor ($q, categoryStore, ingredientStore) {
    'ngInject';

    this.$q = $q;
    this.categoryStore = categoryStore;
    this.ingredientStore = ingredientStore;
  }

  fetchAll () {
    return this.$q
      .all([
        this.categoryStore.fetchAllCategories(),
        this.ingredientStore.fetchAllIngredients()
      ]);
  }

  createCategory (categoryName) {
    return this.categoryStore
      .createCategory({
        name: categoryName
      });
  }

  destroyCategory (categoryId) {
    return this.categoryStore.destroyCategory(categoryId);
  }

  updateIngredient (ingredientId, obj) {
    return this.ingredientStore.updateIngredient(ingredientId, obj);
  }

  selectCategories () {
    return this.categoryStore.selectAllCategories();
  }

  selectIngredientsForCategory (categoryId) {
    return _.sortBy(
      this.ingredientStore.selectAllIngredients().filter(ingredient => ingredient.category_id === categoryId),
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
