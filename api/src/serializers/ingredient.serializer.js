const serialize = ingredient => ({
  id: ingredient.id,
  name: ingredient.name
});

module.exports = {
  serialize
};
