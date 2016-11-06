import {Db} from '../config/db';
import { ArticleModel } from '../models/article';
import { RatingModel } from '../models/rating';
import * as async from 'async';


export class Article {
    private db;

    constructor() {
        this.db = new Db();
    }

    public getAll(cb) {
        this.db.query('SELECT * FROM article ORDER by id DESC', [], (err, result) => {
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
        this.db.query(`
                SELECT 
                    a.id "id",
                    a.title "title",
                    a.body "body",
                    a.user_id "user_id",
                    array_to_json(array_agg(row_to_json(r.*))) rating
                FROM article a 
                LEFT JOIN (
                    SELECT 
                        id,
                        user_id,
                        feedback,
                        rating,
                        article_id
                    FROM rating ORDER BY id DESC
                ) r ON r.article_id = a.id 
                WHERE a.id = $1 GROUP BY a.id;
            `, [id], (err, result) => {
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

    public rate(rating: RatingModel, cb) {
        this.db.query(`
            INSERT INTO rating (
                user_id, 
                article_id, 
                feedback, 
                rating
            )
            VALUES ($1, $2, $3, $4)
        `, [rating.user_id, rating.article_id, rating.feedback, rating.rating], (err, result) => {
            if (err) return cb(err);

            cb(null, result.rows);
        });
    }

    public removeRating(data, cb) {
        async.waterfall([
            (next) => {
                this.getOne(data.article_id, (err, result) => {
                    if (err) return next(err);
                    next(null, result);
                });
            },
            (article, next) => {
                this.db.query('DELETE FROM rating WHERE id = $1', [data.id], (err, result) => {
                    if (err) return next(err);

                    next(null, result.rows);
                });
            }
        ], (err, result) => {
            if (err) return cb(err);

            cb(null, result);
        });
    }

}
