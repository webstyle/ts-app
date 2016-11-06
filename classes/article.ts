import {Db} from '../config/db';
import { ArticleModel } from '../models/article';

export class Article {
    private db;

    constructor() {
        this.db = new Db();
    }

    public getAll(cb) {
        this.db.query('SELECT * FROM article', [], (err, result) => {
            if (err) return cb(err);         
            
            cb(null, result.rows);
        });
    }

    public insert(data: ArticleModel, cb) {
        this.db.query(`
            INSERT INTO article(
                title,
                body, 
                user_id
            ) VALUES ($1, $2, $3);
        `, [data.title, data.body, data.user_id], (err, result) => {
            if (err) return cb(err);

            cb(null, result.rows);
        });
    }

    public getOne(id: number, cb) {
        this.db.query('SELECT * FROM article WHERE id = $1', [id], (err, result) => {
            if (err) return cb(err);

            cb(null, result.rows[0]);
        });
    }

    public update(data: ArticleModel, id: number, cb) {
        this.db.query('UPDATE article SET title = $1, body = $2 WHERE id = $3', [data.title, data.body, id], (err, result) => {
            if (err) return cb(err);

            cb(null, result.rows); 
        });
    } 

    public remove(id: number, cb) {
        this.db.query('DELETE FROM article WHERE id = $1', [id], (err, result) => {
            if (err) return cb(err);

            cb(null, result.rows);
        });
    }

}
