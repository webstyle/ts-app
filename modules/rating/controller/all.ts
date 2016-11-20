import * as express from 'express';
import {Article} from "../../../classes/article";
import {RatingModel} from "../../../common/models/rating";
const router = express.Router();
const article = new Article();


/// rating routes
router.post('/article/:id/rating', requiredId, (req: express.Request, res: express.Response) => {
    let id = req.params.id;

    if (!req.body) return res.send('BODY required');

    let rating: RatingModel = req.body;
    rating.article_id = id;

    article.rate(rating, (err, result) => {
        if (err) return res.send(err.message);

        res.json(result);
    });
});

router.delete('/article/:articleId/rating/:id', requiredId, (req: express.Request, res: express.Response) => {
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

// helper middleware
function requiredId(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!req.params.id) return res.send('ID required');

    next();
}
