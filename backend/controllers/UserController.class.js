import Controller from './Controller.class.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const SALT_ROUNDS = 14;

class UserController extends Controller {
    static #instance;
    static {
        this.#instance = new UserController();
    }

    constructor() {
        super();
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

    }

    static getInstance()
    {
        return this.#instance;
    }
}

export default UserController;