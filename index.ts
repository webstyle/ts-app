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


app.get('/', (req: express.Request, res: express.Response) => {
    res.json({message: 'App'});
});


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
