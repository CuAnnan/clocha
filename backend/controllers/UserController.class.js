import Controller from './Controller.class.js';


class UserController extends Controller
{
    constructor()
    {
        super();
    }

    async addUser(req, res)
    {
        this.db.collection("users").insertOne({username:req.body.username});
    }
}

export default UserController;