import { DB } from '../config/db';

export class BaseController {
  private db;

  constructor() {
    this.db = new DB();
  }

  public query(sql, params, callback) {
    this.db.query(sql, params, (err, result) => {
        if (err) return callback(err);

        callback(null, err);
    });
  }

}
