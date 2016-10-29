import {RatingModel} from "../models/rating";
import {UserModel} from "../models/user";


// Mock values
let user: UserModel[] = [
    {
        id: 1,
        name: 'john'
    },
    {
        id: 2,
        name: 'doe'
    }
];

let orders: OrderModel[] = [{
    id: 12,
    userId: 1
}];


let storage: RatingModel[] = [];

// Rating class
export class Rating {

    public rate(input: RatingModel): RatingModel {
        for (let i:number = 0; i < orders.length; i++) {
            if (orders[i].userId == input.userId) {
                storage.push(input);
            } else {
                console.log('Access denied');
            }
        }

        return input;
    }

    public getAll(): RatingModel[] {
        return storage;
    }

    public getOne(index: number): RatingModel {
        return storage[index];
    }

    public updateRating(index: number, input: RatingModel): RatingModel {
        storage[index] = input;

        return storage[index];
    }

}
