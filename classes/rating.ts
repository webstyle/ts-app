import {RatingModel} from "../models/rating";
import {UserModel} from "../models/user";
import { BaseController } from "./controller";
import { DB } from "../config/db";

// Rating class
export class Rating {
   private db;

   constructor() {
     this.db = new DB();
   }

    public rate(input: Rating, callback) {
        this.db.query('UPDATE', [input], (err, result) => {
          if (err) return callback(err)

          callback(null, result);
        });
    }

    public getAll(callback) {
        this.db.query('SELECT * FROM rating', [], (err, result) => {
            if (err) return callback(err);

            callback(null, result);
        });
    }

    public getOne(index: number) {
    }

    public updateRating(index: number, input) {
    }

}
