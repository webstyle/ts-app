export interface RatingModel {
    id?:        number;
    user_id:    number;
    article_id: number;
    feedback:   string;
    rating:     number;
}