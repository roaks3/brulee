const _ = require('lodash');
const pg = require('./pg.service');

const find = ({ ids, names, categoryId }) => {
  const query = pg.knex('ingredients').select();

  if (ids) {
    query.whereIn('id', ids);
  }

  if (names) {
    query.whereIn('name', names);
  }

  if (categoryId) {
    query.where({ category_id: categoryId });
  }

  return query;
};

const create = async obj => {
  const fields = _.pick(obj, ['name', 'category_id']);

  const [result] = await pg
    .knex('ingredients')
    .insert(fields)
    .returning('*');

  return result || {};
};

const update = async (id, obj) => {
  const fields = _.pick(obj, ['name', 'category_id']);

  const [result] = await pg
    .knex('ingredients')
    .update(fields)
    .where({ id })
    .returning('*');

  return result || {};
};

const deleteOne = id =>
  pg
    .knex('ingredients')
    .del()
    .where({ id })
    .return({ id });

module.exports = {
  find,
  create,
  update,
  deleteOne
};
