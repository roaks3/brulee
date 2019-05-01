import { Category, CategoryResponse } from '../models/category.model';

export const serialize = (category: Category): CategoryResponse => ({
  id: category.id,
  name: category.name,
  display_order: category.display_order
});
