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

    async getGeoJSONByDate(req, res)
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


    static getInstance()
    {
        return SiteController.#instance;
    }
}

export default SiteController;