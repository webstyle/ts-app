import { RatingModel } from './rating';

export interface ArticleModel {
    id?: number;
    title: string;
    body: string;
    user_id: Number;
    rating?: RatingModel[]
}