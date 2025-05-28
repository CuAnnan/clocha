import Controller from './Controller.class.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import conf from '../../conf.js'
const SALT_ROUNDS = 14;


class UserController extends Controller {
    static #instance;
    static {
        this.#instance = new UserController();
    }

    constructor() {
        super();
    }

    confirmUserId(username, password)
    {
        const userNotFoundError = "Username or password incorrect";

        return new Promise(async (resolve, reject)=>{
            const user = await this.db.collection('users').findOne({username});
            if(!user)
            {
                reject(userNotFoundError);1
                return;
            }
            bcrypt.compare(password, user.passwordHash, (err, result) => {
                if(result)
                {
                    resolve(user);
                }
                else
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    reject(userNotFoundError);
                }
            });
        });
    }

    async addUser(req, res) {
        let user = req.body;
        user.passwordHash  = await bcrypt.hash(req.body.password, SALT_ROUNDS);
        delete user.password;
        const newUser = await this.db.collection('users').insertOne(user);
        res.json(newUser);
    }

    async login(req, res)
    {
        try
        {
            let user = await this.confirmUserId(req.body.username, req.body.password);
            delete user.passwordHash;
            const userToken = Object.assign({}, user);
            const accessToken = jwt.sign(userToken,conf.express.jwt.secret,{expiresIn: '1m'});
            const refreshToken = jwt.sign(userToken, conf.express.jwt.secret, {expiresIn: '1d'});
            res.status(200).json({login: true, accessToken, refreshToken, user:userToken});
        }
        catch(err)
        {
            console.log(err);
            res.status(401).json({login:false, errors:["Username or password incorrect"]});
        }
    }

    static getInstance()
    {
        return this.#instance;
    }
}

export default UserController;