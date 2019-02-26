const _ = require('lodash');
const pg = require('./pg.service');
const { SQL } = require('sql-template-strings');

const create = obj => {
  const fields = _.pick(obj, ['id', 'name', 'category_id']);
  if (_.isEmpty(fields)) {
    throw new Error('No valid fields provided to create ingredient');
  }

  return pg.pgQuery(
    pg.createSql('ingredients', fields)
  );
};

const updateName = (id, name) =>
  pg.pgQuery(SQL`
    update ingredients
    set name = ${name}
    where id = ${id}
  `);

const updateCategory = (id, categoryId) =>
  pg.pgQuery(SQL`
    update ingredients
    set category_id = ${categoryId}
    where id = ${id}
  `);

const deleteOne = id =>
  pg.pgQuery(SQL`
    delete from ingredients
    where id = ${id}
  `);

module.exports = {
  create,
  updateName,
  updateCategory,
  deleteOne
};
