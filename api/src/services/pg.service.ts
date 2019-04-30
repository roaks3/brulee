import { SQL, SQLStatement } from 'sql-template-strings';
import pg from 'pg';
import knex from 'knex';

const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

export const pgQuery = (sql: SQLStatement): Promise<any[]> =>
  pgPool.connect().then(connection =>
    connection
      .query(sql)
      .then(result => {
        connection.release();
        return result.rows;
      })
      .catch(e => {
        connection.release();
        throw e;
      })
  );

const knexClient = knex({
  client: 'postgres',
  connection: process.env.DATABASE_URL
});

export { knexClient as knex };
