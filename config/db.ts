var pg = require('pg.js');
import { QueryResult, Client } from "pg";

interface Config {
    user: string;
    database: string,
    password: string;
    host: string;
    port: string;
    max: string;
    idleTimeoutMillis: string;
}

export class DB {
    private pg;

    constructor() {
        this.pg = new pg.Pool({
            user: 'user',
            database: 'db',
            password: 'password',
            host: 'localhost',
            port: 5432,
            max: 10,
            idleTimeoutMillis: 30000,
        });
    }

    query (sql: string, params: any[], callback) {
      pg.connect((err, client, done) => {
          if (err) return console.log('Failed to connect to database');
          client.query(sql, params, err, (err, result) => {
              if (err) return callback(err);

              callback(null, result);
          })
      });
    }


}
