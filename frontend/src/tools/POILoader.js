import {client} from './AxiosInterceptor.js';


/**
 * A class to load the points of interests from the indexed db
 * This will also be responsible for syncing the state with the backend
 */
class POILoader
{
    /**
     * A reference to the indexed db
     */
    static #db;
    /**
     * A reference to the types of entry in the indexed db
     */
    static #types;
    /**
     * A promise to make sure the poi loader has loaded everything and is ready to serve query requests to the indexedDB
     */
    static #readyPromise;

    static {
        this.#readyPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open("clochaDB", 1);
            request.onerror = (evt) => reject(evt);
            request.onsuccess = async (evt) => {
                this.#db = evt.target.result;
                this.#types = {};
                await this.#syncIndexedDB();
                await this.#getPOIFromIndexedDB({});
                resolve();
            };
            request.onupgradeneeded = (evt) => {
                this.#db = evt.target.result;
                if (!this.#db.objectStoreNames.contains("sites")) {
                    const objectStore = this.#db.createObjectStore("sites", { keyPath: 'smrs' });
                    objectStore.createIndex('county', 'county', { unique: false });
                    objectStore.createIndex('type', 'type', { unique: false });
                    objectStore.createIndex('type_and_county', ['type', 'county'], { unique: false });
                }
            };
        });
    }

    static ready() {
        return this.#readyPromise;
    }


    static async fetchPOI({type, county })
    {
        await this.#syncIndexedDB();
        return await this.#getPOIFromIndexedDB({type, county});
    }

    static async #getPOIFromIndexedDB({type, county})
    {
        const transaction = this.#db.transaction(["sites"], 'readonly');
        const objectStore = transaction.objectStore('sites');

        return new Promise(
            (resolve, reject)=>{
                const getAll = objectStore.getAll();
                getAll.onsuccess = (evt)=>{
                    const results = evt.target.result;
                    let POI = [];
                    if(type || county)
                    {
                        POI = (results.filter(
                            (site)=> {
                                if(type && site.type !== type)
                                {
                                    return false;
                                }
                                else if(county && site.county !== county)
                                {
                                    return false;
                                }
                                return true;
                            }
                        ));
                    }
                    else
                    {
                        POI = results;
                    }
                    const sites=[];
                    const types = new Set();
                    for(let site of POI)
                    {
                        types.add(site.type);
                        site.cluster = false;
                        sites.push({
                            type: 'Feature',
                            properties: site,
                            geometry: {
                                type: 'Point',
                                coordinates: [site.longitude, site.latitude, 0]
                            }
                        });
                    }
                    this.#types = Array.from(types);
                    resolve(sites);
                }
                getAll.onerror = (evt)=>{
                    reject(evt);
                }
            }
        );

    }

    static getSiteTypes()
    {
        return this.#types;
    }

    static async #getUpdatedSites()
    {
        let lastRemoteLoadDate = localStorage.getItem("lastRemoteLoadDate");
        lastRemoteLoadDate = lastRemoteLoadDate||"";
        const response = await client.get(`/sites/sinceUpdate/${lastRemoteLoadDate}`);
        localStorage.setItem("lastRemoteLoadDate", Date.now().toString());
        return response.data.sites;
    }

    static async #syncIndexedDB() {
        const updatedSites = await this.#getUpdatedSites();

        return new Promise((resolve, reject) => {
            const transaction = this.#db.transaction(["sites"], 'readwrite');
            transaction.oncomplete = (evt) => resolve(evt);
            transaction.onerror = (evt) => reject(evt);

            const objectStore = transaction.objectStore('sites');

            (async () => {
                try {
                    for (const site of updatedSites) {
                        if (!site.type) {
                            site.type = site.classdesc;
                        }
                        await new Promise((res, rej) => {
                            const req = objectStore.put(site);
                            req.onsuccess = () => res();
                            req.onerror = (e) => rej(e);
                        });
                    }
                } catch (err) {
                    transaction.abort();
                    reject(err);
                }
            })();
        });
    }
}

export default POILoader;