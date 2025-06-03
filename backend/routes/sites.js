import express from 'express';
import multer from 'multer';

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

import SiteController from "../controllers/SiteController.class.js";

const controller = SiteController.getInstance();


router.get('/', function (req, res, next) {
    controller.getSitesByDateModified(req, res).catch(next);
});

router.get('/sinceUpdate/:lastUpdated?', function (req, res, next) {
    controller.getSitesByDateModified(req, res).catch(next);
});

router.post(
    '/images',
    controller.checkForJWTToken,
    upload.array("images"),
    function (req, res, next)
    {
        controller.handleImageUpload(req, res).catch(next);
    }
);

router.get(
    '/favourites',
    controller.checkForJWTToken,
    function (req, res, next)
    {
        controller.getFavourites(req, res).catch(next);
    }
);

export default router;