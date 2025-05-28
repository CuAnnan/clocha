import UserController from '../controllers/UserController.class.js';
import express from 'express';
const router = express.Router();


const controller = UserController.getInstance();

router.post('/register', (req, res, next)=>{
    controller.addUser(req, res).catch(next);
});

router.post('/login', (req, res, next)=>{
    controller.login(req, res).catch(next);
});

export default router;