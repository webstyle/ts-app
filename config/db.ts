import * as pg from 'pg';

export class Db {
    private db;

    constructor() {
        this.db = new pg.Pool({
            user: 'postgres', 
            database: 'rating', 
            password: 'qwerty', 
            host: 'localhost', 
            port: 5432, 
            max: 10, 
            idleTimeoutMillis: 30000, 
        });
    }

    public query (sql: string, params: any[], cb) {
        this.db.connect((err, client, done) => {
            if (err) return cb(err);

            client.query(sql, params, (err, result) => {
                if (err) return cb(err);

                done();
                cb(null, result);
            });
        });
    }

}