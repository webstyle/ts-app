// load modules
import * as express from 'express';
import * as bodyParser from 'body-parser';


// load classes
import { Db } from './config/db';
import { Article } from './classes/article';


// load models
import { ArticleModel } from './models/article';
import { RatingModel } from './models/rating';


// init application
const app = express();
const port: number = 3000;
const db = new Db;
const article = new Article;


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));


// articles routes
app.get('/article', (req: express.Request, res: express.Response) => {
    article.getAll((err, result: ArticleModel[]) => {
        if (err) return res.send(err.message);

        res.json(result);
    });
});

app.post('/article', (req: express.Request, res: express.Response) => {
    if (!req.body) return res.send('body is empty');
    let body: ArticleModel = req.body; 
    article.insert(body, (err, result) => {
        if (err) res.send(err.message);

        res.json(result);
    });
});

app.get('/article/:id', requiredId, (req: express.Request, res: express.Response) => {
    let id = req.params.id; 
    
    article.getOne(id, (err, result: ArticleModel) => {
        if (err) return res.send(err.message);
        if (!result) return res.send('empty');
 
        res.json(result);
    });
});

app.put('/article/:id', requiredId, (req: express.Request, res: express.Response) => {
    if (!req.body) return res.send('ID and BODY required');
    let id = req.params.id;
    let body = req.body;

    article.update(body, id, (err, result) => {
        if (err) return res.send(err.message);

        res.json(result)
    }); 

});

app.delete('/article/:id', requiredId, (req: express.Request, res: express.Response) => {
    let id = req.params.id;

    article.remove(id, (err, result) => {
        if (err) return res.send(err.message);

        res.json(result);
    });

});


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
})

// helper middleware
function requiredId(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!req.params.id) return res.send('ID required');

    next(); 
}


// clustering
var cluster = require('cluster');

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
