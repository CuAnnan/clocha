import Controller from './Controller.class.js';
import bcrypt from 'bcrypt';
const SALT_ROUNDS = 13;

class UserController extends Controller
{
    static #instance;
    static {
        this.#instance = new UserController();
    }

    constructor()
    {
        super();
    }

    async addUser(req, res)
    {
        const passwordHash = await bcrypt.hash(req.body.password, SALT_ROUNDS);
        delete req.body.password;
        const newUser = await this.db.collection('users').insertOne({...req.body, passwordHash});
        res.json(newUser);
    }

    static getInstance()
    {
        return this.#instance;
    }
}

export default UserController;