'use strict';

class CategoryPageStore {

  constructor (Category, categoryService, Ingredient) {
    this.Category = Category;
    this.categoryService = categoryService;
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

  saveAllCategories () {
    return this.categoryService
      .updateAll(this.categories);
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

  addIngredientToCategory (ingredientId, category) {
    // Remove ingredient from all other categories
    _.each(this.categories, otherCategory => {
      this.removeIngredientFromCategory(ingredientId, otherCategory);
    });

    // Add ingredient to this category
    const categoryIndex = this.categories.findIndex(c => c.id === category.id);
    this.categories[categoryIndex] = Object.assign({}, this.categories[categoryIndex], {
      ingredient_ids: [...this.categories[categoryIndex].ingredient_ids, ingredientId]
    });
  }

  removeIngredientFromCategory (ingredientId, category) {
    const categoryIndex = this.categories.findIndex(c => c.id === category.id);
    this.categories[categoryIndex] = Object.assign({}, this.categories[categoryIndex], {
      ingredient_ids: this.categories[categoryIndex].ingredient_ids.filter(id => id !== ingredientId)
    });
  }

  getIngredient (id) {
    return this.Ingredient.get(id) || {};
  }

}

angular.module('bruleeApp.services')
  .service('categoryPageStore', CategoryPageStore);
