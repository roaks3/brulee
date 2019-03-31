const _ = require('lodash');
const pg = require('./pg.service');

const find = ({ ids }) => {
  const query = pg.knex('categories').select();

  if (ids) {
    query.whereIn('id', ids);
  }

  return query;
};

const create = async obj => {
  const fields = _.pick(obj, ['name', 'display_order']);

  const [result] = await pg
    .knex('categories')
    .insert(fields)
    .returning('*');

  return result || {};
};

const update = async (id, obj) => {
  const fields = _.pick(obj, ['name', 'display_order']);

  const [result] = await pg
    .knex('categories')
    .update(fields)
    .where({ id })
    .returning('*');

  return result || {};
};

const deleteOne = id =>
  pg
    .knex('categories')
    .del()
    .where({ id })
    .return({ id });

module.exports = {
  find,
  create,
  update,
  deleteOne
};
