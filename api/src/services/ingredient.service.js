const _ = require('lodash');
const { SQL } = require('sql-template-strings');
const pg = require('./pg.service');

const find = ({ ids, names, categoryId }) => {
  const query = SQL`
    select *
    from ingredients
  `;

  if (ids) {
    query.append(SQL`
      where id = any(${ids})
    `);
  }

  if (names) {
    query.append(SQL`
      where name = any(${names})
    `);
  }

  if (categoryId) {
    query.append(SQL`
      where category_id = ${categoryId}
    `);
  }

  return pg.pgQuery(query);
};

const create = async obj => {
  const fields = _.pick(obj, ['name', 'category_id']);
  if (_.isEmpty(fields)) {
    throw new Error('No valid fields provided to create ingredient');
  }

  const result = await pg.pgQuery(pg.createSql('ingredients', fields));

  return result && result.length ? result[0] : {};
};

const update = async (id, obj) => {
  const fields = _.pick(obj, ['name', 'category_id']);

  if (_.isEmpty(fields)) {
    throw new Error('No valid fields provided to update ingredient');
  }

  const query = pg.updateSql('ingredients', fields);

  query.append(SQL`
    where id = ${id}
    returning *
  `);

  const result = await pg.pgQuery(query);

  return result && result.length ? result[0] : {};
};

const updateCategoryForAll = (ids, categoryId) =>
  pg.pgQuery(SQL`
    update ingredients
    set category_id = ${categoryId}
    where id = any(${ids})
  `);

const deleteOne = async id => {
  const result = await pg.pgQuery(SQL`
    delete from ingredients
    where id = ${id}
    returning *
  `);

  return result && result.length ? result[0] : {};
};

module.exports = {
  find,
  create,
  update,
  updateCategoryForAll,
  deleteOne
};
