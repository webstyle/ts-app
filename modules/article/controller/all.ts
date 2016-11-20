// import
import * as express from 'express';
import {ArticleModel} from "../../../common/models/article";
import {Article} from "../../../classes/article";
const router = express.Router();
const article = new Article();


// articles routes
router.get('/article', (req: express.Request, res: express.Response) => {
    article.getAll((err, result: ArticleModel[]) => {
        if (err) return res.send(err.message);

        res.json(result);
    });
});

router.post('/article', (req: express.Request, res: express.Response) => {
    if (!req.body) return res.send('body is empty');
    let body: ArticleModel = req.body;
    article.insert(body, (err, result) => {
        if (err) res.send(err.message);

        res.json(result);
    });
});

router.get('/article/:id', requiredId, (req: express.Request, res: express.Response) => {
    let id = req.params.id;

    article.getOne(id, (err, result: ArticleModel) => {
        if (err) return res.send(err.message);
        if (!result) return res.send('empty');

        res.json(result);
    });
});

router.put('/article/:id', requiredId, (req: express.Request, res: express.Response) => {
    if (!req.body) return res.send('ID and BODY required');
    let id = req.params.id;
    let body = req.body;

    article.update(body, id, (err, result) => {
        if (err) return res.send(err.message);

        res.json(result)
    });

});

router.delete('/article/:id', requiredId, (req: express.Request, res: express.Response) => {
    let id = req.params.id;

    article.remove(id, (err, result) => {
        if (err) return res.send(err.message);

        res.json(result);
    });

});

// helper middleware
function requiredId(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!req.params.id) return res.send('ID required');

    next();
}
