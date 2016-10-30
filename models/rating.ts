export interface RatingModel {
    id?: number;
    user_id: number;
    article_id: number;
    rating: number;
    feedback: string;
}
