import Controller from "./Controller.class.js";

/*
 * This code sets up the matches for what the text searches provided look for in the database.
 * The simple query variables are just name:<provided value> but the simple fix types are name:<regex matching>
 */
let simpleQryVariables = ["Anomalous stone group",
    "Boulder-burial",
    "Ceremonial enclosure",
    "Cliff-edge fort",
    "Henge",
    "Hillfort",
    "Hilltop enclosure",
    "Megalithic structure",
    "Stone row",
    "Stone sculpture - aniconic",
    "Stone sculpture - iconic"];

let allQryTypes = {};

for(let simpleQryVariable of simpleQryVariables)
{
    allQryTypes[simpleQryVariable] = {'name':simpleQryVariable};
}


const simpleFixes = ["Bullaun stone","Cairn","Megalithic structure","Megalithic tomb", "Ogham stone","Ringfort","Rock art","Standing stone","Stone circle", "motte"];
for(let fix of simpleFixes)
{
    allQryTypes[fix]={"name":{"$regex":`${fix}.*`}};
}


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
        let types = await this.getSiteTypes(req, res);
        let qry = {
            'classdesc': {'$in': types},
            "longitude": {"$gte": -15}
        };
        if(req.query.lastUpdated)
        {
            qry.lastUpdate = {"$gte":parseInt(req.query.lastUpdated)};
        }
        if(req.query.county)
        {
            qry.county = req.query.county;
        }

        const sites = [];
        const cursor = await this.db.collection('sites').find(qry, {projection:{_id: 0 }}).batchSize(50000);
        const start = performance.now();
        for await(const site of cursor)
        {
            sites.push(site);
        }

        const end = performance.now();
        const total = end - start;
        res.json({sites, total});
    }

    async getSiteTypes(req, res)
    {
        let typesJSON = await this.db.collection('types').find({"$or":Object.values(allQryTypes)},{projection:{ _id: 0 }}).toArray();

        let types = [];
        for(let val of typesJSON)
        {
            types.push(val.name);
        }

        return types;
    }


    static getInstance()
    {
        return SiteController.#instance;
    }
}

export default SiteController;