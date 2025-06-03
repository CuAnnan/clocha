import Controller from "./Controller.class.js";

class SiteController extends Controller
{
    static #instance;
    static
    {
        this.#instance = new SiteController();
    }

    constructor()
    {
        super();
    }

    async getSiteBySMRS(smrs)
    {
        return await this.db.collection('sites').findOne({smrs});
    }

    async getSitesByDateModified(req, res)
    {
        let qry = {
            'type':{'$ne':null},
            "longitude": {"$gte": -15}
        };
        if(req.params.lastUpdated)
        {
            qry.lastUpdate = {"$gte":parseInt(req.params.lastUpdated)};
        }
        if(req.query.county)
        {
            qry.county = req.query.county;
        }

        const sites = [];
        let count = await this.db.collection('sites').countDocuments(qry);

        const cursor = await this.db.collection('sites').find(qry, {projection:{_id: 0 }}).batchSize(60000);
        const start = performance.now();
        for await(const site of cursor)
        {
            sites.push(site);
        }

        const end = performance.now();
        const queryDuration = end - start;
        res.json({sites, queryDuration, count});
    }

    async handleImageUpload(req, res)
    {
        const files = req.files;
        const site = JSON.parse(req.body.site);

        console.log(site);
        res.json({"Doing stuff":true});
    }

    async addFavourite(req, res)
    {
        let siteController = SiteController.getInstance();
        let site = await siteController.getSiteBySMRS(req.body.smrs);

        const qry = {
            idUsers:req.user.id,
            idSites:site._id
        }

        await this.db.collection('favourites').updateOne(
            qry,
            qry,
            {upsert:true}
        );
        res.json({success:true});
    }

    async getFavourites(req, res)
    {
        let qry = await this.db.collection('favourites').find({idUsers:req.user.id}).project({_id:1});
        let sites = [];
        for await(const site of qry)
        {
            sites.push(site);
        }
        res.json({sites});
    }


    static getInstance()
    {
        return SiteController.#instance;
    }
}

export default SiteController;