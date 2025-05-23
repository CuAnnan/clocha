import {MongoClient} from "mongodb";
import {mongo} from '../../conf.js';


class Controller
{
    static #db;
    static {
        const connectionString = `mongodb://${mongo.user}:${mongo.pass}@${mongo.host}`;
        const client = new MongoClient(connectionString);

        client.connect().then(()=>{
            this.#db = client.db("stoneCircles");
        });
    }

    get db()
    {
        return Controller.#db;
    }

    static getInstance()
    {
        throw new Error(this.constructor.name+" does not implement getInstance()");
    }
}

export default Controller;