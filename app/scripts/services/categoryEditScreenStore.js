import angular from 'angular';

import categoryStore from '../../store/categoryStore';
import Category from '../datastores/Category';
import Ingredient from '../datastores/Ingredient';

class CategoryEditScreenStore {

  constructor ($q, categoryStore, Category, Ingredient) {
    'ngInject';

    this.$q = $q;
    this.categoryStore = categoryStore;
    this.Category = Category;
    this.Ingredient = Ingredient;
    this.categories = [];
    this.ingredients = [];
  }

  fetchAllCategories () {
    return this.Category
      .refreshAll()
      .then(categories => {
        this.categories = categories;
      });
  }

  fetchAllIngredients () {
    return this.Ingredient
      .refreshAll()
      .then(ingredients => {
        this.ingredients = ingredients;
      });
  }

  createCategory (categoryName) {
    return this.Category
      .create({
        name: categoryName,
        order: this.categories.length + 1,
        ingredient_ids: []
      })
      .then(category => {
        this.categories = [...this.categories, category];
        return category;
      });
  }

  destroyCategory (categoryId) {
    return this.Category
      .destroy(categoryId)
      .then(() => {
        this.categories = this.categories.filter(c => c.id !== categoryId);
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
      this.ingredients.filter(ingredient => category.ingredient_ids.includes(ingredient.id)),
      'name'
    );
  }

}

export default angular
  .module('services.categoryEditScreenStore', [
    categoryStore,
    Category,
    Ingredient
  ])
  .service('categoryEditScreenStore', CategoryEditScreenStore)
  .name;
