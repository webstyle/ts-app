import * as express from 'express';
import { Db } from './config/db';
import { Article } from './models/article';
import * as bodyParser from 'body-parser';

const app = express();
const port: number = 3000;
const db = new Db;

console.log(process.env);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// index
app.get('/', (req: express.Request, res: express.Response) => {
    let newArticle: Article = {
        title: 'Hello world',
        body: 'string',
        user_id: 1
    }

    db.query('INSERT INTO article (title, body, user_id) VALUES ($1, $2, $3);', [newArticle.title, newArticle.body, newArticle.user_id], (err, result) => {
        if (err) return res.send(err.message);

        res.json(result.rows);
    });

});

app.listen(port);
console.log(`server is run on port ${port}`);
