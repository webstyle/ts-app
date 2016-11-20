// load modules
import * as express from 'express';
import * as bodyParser from 'body-parser';


// load classes
import { Db } from './config/db';
import { Article } from './classes/article';


// load models
import { ArticleModel } from './common/models/article';
import { RatingModel } from './common/models/rating';


// init application
const app = express();
const port: number = 3000;
const db = new Db;
const article = new Article;


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// rating routes
app.post('/article/:id/rating', requiredId, (req: express.Request, res: express.Response) => {
    let id = req.params.id;

    if (!req.body) return res.send('BODY required');
 
    let rating: RatingModel = req.body;
    rating.article_id = id;

    article.rate(rating, (err, result) => {
        if (err) return res.send(err.message);

        res.json(result);
    });
});

app.delete('/article/:articleId/rating/:id', requiredId, (req: express.Request, res: express.Response) => {
    if (!req.params.articleId) return res.send('Article ID required');
    let params = {
        id: req.params.id,
        articleId: req.params.articleId
    }

    article.removeRating(params, (err, result) => {
        if (err) return res.send(err.message);

        res.json(result);
    });

});

app.get('/', (req: express.Request, res: express.Response) => {
    res.json({message: 'App'});
});

// helper middleware
function requiredId(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!req.params.id) return res.send('ID required');

    next(); 
}


// clustering
const cluster = require('cluster');

if(cluster.isMaster) {
    var numWorkers = require('os').cpus().length;

    console.log('Master cluster setting up ' + numWorkers + ' workers...');

    for(var i = 0; i < numWorkers; i++) {
        cluster.fork();
    }

    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online');
    });

    cluster.on('exit', function(worker, code, signal) {
        console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
        console.log('Starting a new worker');
        cluster.fork();
    });
} else {
    app.listen(port, () => {
        console.log(`Server is run on port ${port}`);
    });
}
