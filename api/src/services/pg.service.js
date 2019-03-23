const _ = require('lodash');
const { SQL } = require('sql-template-strings');
const pg = require('pg');

const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

const pgQuery = sql =>
  pgPool.connect().then(connection =>
    connection
      .query(sql)
      .then(result => {
        connection.release();
        return result && result.rows;
      })
      .catch(e => {
        connection.release();
        throw e;
      })
  );

const createSql = (tablename, obj) => {
  if (_.isEmpty(obj)) {
    throw new Error(
      `Cannot generate create sql for an empty object: ${tablename}`
    );
  }

  const fieldPairs = _.toPairs(obj);
  const query = SQL`
    insert into
  `;

  query.append(tablename);

  query.append(`
    (${fieldPairs.map(p => p[0]).join(', ')})
    values
    (
  `);

  query.append(SQL`${fieldPairs[0][1]}`);

  fieldPairs.slice(1).forEach(([, val]) => {
    query.append(SQL`, ${val}`);
  });

  query.append(') returning *');

  return query;
};

const updateSql = (tablename, obj) => {
  if (_.isEmpty(obj)) {
    throw new Error(
      `Cannot generate update sql for an empty object: ${tablename}`
    );
  }

  const fieldPairs = _.toPairs(obj);
  const query = SQL`
    update
  `;

  query.append(tablename);

  query.append(`
    set ${fieldPairs[0][0]} =
  `);

  query.append(SQL`${fieldPairs[0][1]}`);

  fieldPairs.slice(1).forEach(([key, val]) => {
    query.append(`
      , ${key} =
    `);

    query.append(SQL`${val}`);
  });

  return query;
};

module.exports = {
  pgQuery,
  createSql,
  updateSql
};
