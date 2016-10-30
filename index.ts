/**
 * My typescript program
 */
import * as express from 'express';
import { Rating } from "./classes/rating";
import { RatingModel } from "./models/rating";
import bodyParser = require("body-parser");

const rating = new Rating();
const app = express();
const port: number = 3000;


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get('/', (req: express.Request, res: express.Response) => {
    rating.getAll((err, result) => {
        if (err) return res.json(err);

        res.json(result);
    });

});

app.post('/', (req: express.Request, res: express.Response) => {
    let body: RatingModel = req.body;

    res.send('rate post');
});

app.get('/:index', (req: express.Request, res: express.Response) => {
    res.send('get one');
});


app.listen(port);
console.log(`server is run on port ${port}`);
