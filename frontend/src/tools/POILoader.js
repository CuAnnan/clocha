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

    static
    {
        const request = indexedDB.open("clochaDB", 1);
        request.onerror = (evt)=>{
            console.warn(evt);
        }
        request.onsuccess = async (evt)=>{
            this.#db = evt.target.result;
            this.#types = {};
            await this.#syncIndexedDB();
            await this.#getPOIFromIndexedDB({});
        };
        request.onupgradeneeded = (evt)=>{
            this.#db = evt.target.result;
            // the smrs for the site is unique. It will do as a keypath
            const objectStore = this.#db.createObjectStore("sites", {keyPath:'smrs'});
            objectStore.createIndex('county', 'county', {unique:false});
            objectStore.createIndex('type', 'type', {unique:false});
            objectStore.createIndex('type_and_county', ['type', 'county'], {unique:false});
        }

    }


    static async fetchPOI({type, county })
    {
        await this.#syncIndexedDB();
        return await this.#getPOIFromIndexedDB({type, county});
    }

    static async #getPOIFromIndexedDB({type, county})
    {
        const transaction = this.#db.transaction(["sites"], 'readwrite');
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
                                if(type && !site.classdesc.matches)
                                {
                                    return false;
                                }
                                if(county && site.county !== county)
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
                    for(let site of POI)
                    {
                        this.#types[site.type] = site.type;
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

    static async #syncIndexedDB()
    {
        const updatedSites = await this.#getUpdatedSites();

        return new Promise((resolve, reject)=>{
            const transaction = this.#db.transaction(["sites"], 'readwrite');
            transaction.oncomplete = (evt) => {
                resolve(evt);
            };
            transaction.onerror = (evt) => {
                reject(evt);
            }
            const objectStore = transaction.objectStore('sites');
            updatedSites.forEach((site)=>{
                if(!site.type)
                {
                    site.type = site.classdesc;
                }
                const request = objectStore.put(site);
                request.onerror = (evt) => {
                    reject(evt);
                }
            });
            transaction.commit();
        });
    }
}

export default POILoader;