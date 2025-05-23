import express from 'express';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

import sitesRouter from './routes/sites.js';
app.use('/sites', sitesRouter);


export default app;