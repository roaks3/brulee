const _ = require('lodash');
const { SQL } = require('sql-template-strings');
const pg = require('./pg.service');

const find = ({ ids }) => {
  const query = SQL`
    select *
    from categories
  `;

  if (ids) {
    query.append(SQL`
      where id = any(${ids})
    `);
  }

  return pg.pgQuery(query);
};

const create = async obj => {
  const fields = _.pick(obj, ['name', 'display_order']);
  if (_.isEmpty(fields)) {
    throw new Error('No valid fields provided to create category');
  }

  const result = await pg.pgQuery(pg.createSql('categories', fields));

  return result && result.length ? result[0] : {};
};

const update = async (id, obj) => {
  const fields = _.pick(obj, ['name', 'display_order']);

  if (_.isEmpty(fields)) {
    throw new Error('No valid fields provided to update category');
  }

  const query = pg.updateSql('categories', fields);

  query.append(SQL`
    where id = ${id}
    returning *
  `);

  const result = await pg.pgQuery(query);

  return result && result.length ? result[0] : {};
};

const deleteOne = async id => {
  const result = await pg.pgQuery(SQL`
    delete from categories
    where id = ${id}
    returning *
  `);

  return result && result.length ? result[0] : {};
};

module.exports = {
  find,
  create,
  update,
  deleteOne
};
