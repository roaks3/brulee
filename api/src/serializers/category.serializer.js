const serialize = (category, ingredients) => ({
  id: category.id,
  name: category.name,
  display_order: category.display_order,
  ingredient_ids: ingredients.map(ingredient => ingredient.id)
});

module.exports = {
  serialize
};
