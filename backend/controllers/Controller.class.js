import {MongoClient} from "mongodb";
import conf from '../../conf.js';
import jwt from 'jsonwebtoken';




class Controller
{
    static #db;
    static {
        const connectionString = `mongodb://${conf.mongo.user}:${conf.mongo.pass}@${conf.mongo.host}`;
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

    async refreshJWTToken(req, res)
    {
        try
        {
            const {idUsers, username, email, address} = await jwt.verify(req.body.refreshToken, conf.express.jwt.secret);
            const newUserToken = {idUsers, username, email, address};
            const accessToken = jwt.sign(newUserToken, conf.express.jwt.secret,{expiresIn: '1m'});
            const refreshToken = jwt.sign(newUserToken, conf.express.jwt.secret, {expiresIn: '1d'});
            res.status(200).json({accessToken, refreshToken});
        }
        catch(e)
        {
            console.log(e);
            res.status(500).sent({error:"An error occured"})
        }
    }

    async checkForJWTToken(req, res, next)
    {
        try
        {
            const token = req.headers.authorization.split(" ")[1];
            const decodedToken = await jwt.verify(token, conf.express.jwt.secret)
            req.user = await decodedToken;
            next();
        }
        catch(e)
        {
            res.status(401).json({message:"TokenExpiredError"});
        }
    }
}

export default Controller;