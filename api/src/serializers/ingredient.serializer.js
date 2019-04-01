const serialize = ingredient => ({
  id: ingredient.id,
  name: ingredient.name,
  category_id: ingredient.category_id
});

module.exports = {
  serialize
};
