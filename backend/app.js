import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

import sitesRouter from './routes/sites.js';
import usersRouter from './routes/users.js';

app.get('/', function(req, res){
    res.json({status:"Running"});
})

app.use('/sites', sitesRouter);
app.use('/users', usersRouter);


export default app;