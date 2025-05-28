import express from 'express';
const router = express.Router();

import SiteController from "../controllers/SiteController.class.js";
const controller = SiteController.getInstance();


router.get('/', function (req, res, next) {
    controller.getGeoJSONByDate(req, res).catch(next);
});

router.get('/sinceUpdate/:lastUpdated?', function (req, res, next) {
    controller.getGeoJSONByDate(req, res).catch(next);
});

export default router;