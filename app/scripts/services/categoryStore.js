import angular from 'angular';

import Category from '../datastores/Category';

class CategoryStore {

  constructor (Category) {
    'ngInject';

    this.Category = Category;
  }

  fetchAllCategories () {
    return this.Category
      .findAll()
      .then(categories => {
        this.categories = categories;
      });
  }

  selectAllCategories () {
    return this.categories;
  }

  selectCategoryById (id) {
    return this.categories.find(category => category.id === id);
  }

  selectCategoriesForIngredients (ingredientIds) {
    return this.categories.filter(category => {
      return category.ingredient_ids.some(ingredientId => ingredientIds.includes(ingredientId));
    });
  }

}

export default angular.module('services.categoryStore', [Category])
  .service('categoryStore', CategoryStore)
  .name;
