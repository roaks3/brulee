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
    const categories = this.selectCategories();
    return this.categoryStore
      .createCategory({
        name: categoryName,
        order: categories.length + 1
      });
  }

  destroyCategory (categoryId) {
    return this.categoryStore.destroyCategory(categoryId);
  }

  addIngredientToCategory (ingredientId, categoryId) {
    const category = this.categoryStore.selectCategoryById(categoryId);
    const categories = this.selectCategories();
    const updatedCategory = Object.assign({}, category, {
      ingredient_ids: [...category.ingredient_ids, ingredientId]
    });
    const removeFromCategories = categories.filter(c => c.ingredient_ids.includes(ingredientId));

    return this.$q
      .all(
        removeFromCategories.map(removeFromCategory => {
          return this.removeIngredientFromCategory(ingredientId, removeFromCategory.id);
        })
      )
      .then(() => this.categoryStore.updateCategory(updatedCategory));
  }

  removeIngredientFromCategory (ingredientId, categoryId) {
    const category = this.categoryStore.selectCategoryById(categoryId);
    const updatedCategory = Object.assign({}, category, {
      ingredient_ids: category.ingredient_ids.filter(id => id !== ingredientId)
    });

    return this.categoryStore.updateCategory(updatedCategory);
  }

  selectCategories () {
    return this.categoryStore.selectAllCategories();
  }

  selectIngredientsForCategory (categoryId) {
    const category = this.categoryStore.selectCategoryById(categoryId);
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