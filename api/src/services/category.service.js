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

const updateName = (id, name) =>
  pg.pgQuery(SQL`
    update categories
    set name = ${name}
    where id = ${id}
  `);

const updateDisplayOrder = (id, displayOrder) =>
  pg.pgQuery(SQL`
    update categories
    set display_order = ${displayOrder}
    where id = ${id}
  `);

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
  updateName,
  updateDisplayOrder,
  deleteOne
};
