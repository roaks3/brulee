const serialize = category => ({
  id: category.id,
  name: category.name,
  display_order: category.display_order
});

module.exports = {
  serialize
};
