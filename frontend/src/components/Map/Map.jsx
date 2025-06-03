import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/styles';
import { useState, useEffect } from 'react';
import {Row, Col, Accordion} from 'react-bootstrap';

import MapComponent from "./MapComponent.jsx";
import DetailsComponent from "./DetailsComponent.jsx";
import FilterComponent from "./FilterComponent.jsx";
import UserSiteComponent from "./UserSiteComponent.jsx";

import POILoader from "../../tools/POILoader.js";

import './map.css';

function Map() {
    const [sites, setSites] = useState([]);
    const [site, setSite] = useState(null);
    const [siteTypes, setSiteTypes] = useState([]);
    const [typeFilters, setTypeFilters] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [mapInstance, setMapInstance] = useState(null);

    useEffect(() => {
        (async () => {
            // Wait until POILoader is ready — you could add a static method like POILoader.ready() that resolves when indexedDB is initialized.
            await POILoader.ready();

            const updatedSites = await POILoader.fetchPOI({});
            setSites(updatedSites);
            setSiteTypes(POILoader.getSiteTypes());
        })().then(() => {
            console.log("Map API request fulfilled");
        });
    }, []);

    let filteredSites =  typeFilters.length > 0
        ? sites.filter(site => {
            return typeFilters.includes(site.properties.type)
        }) // Adjust 'site.type' if needed
        : sites;
    filteredSites = searchText?filteredSites.filter(site=>{
        return (
            site.properties.townland_name.toLowerCase().includes(searchText.toLowerCase()) ||
            site.properties.smrs.toLowerCase().includes(searchText.toLowerCase())
        );
    }):filteredSites;

    return (
        <div className="map-wrapper">
            <Row className="h-100 gx-0"> {/* gx-0 removes gutters */}
                <Col xs={12} lg={2} className="bg-light d-none d-md-block accordion">
                    <Accordion defaultActiveKey="1">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Filters ({typeFilters.length})</Accordion.Header>
                            <Accordion.Body>
                                <FilterComponent setSite={setSite} mapInstance={mapInstance} siteTypes={siteTypes} sites={sites} typeFilters={typeFilters} setTypeFilters={setTypeFilters} searchText={searchText} setSearchText={setSearchText} />
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Details</Accordion.Header>
                            <Accordion.Body>
                                <DetailsComponent site={site}/>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey="2">
                            <Accordion.Header>User Options</Accordion.Header>
                            <Accordion.Body>
                                <UserSiteComponent site={site}/>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>
                <Col xs={12} lg={10} className="h-100">
                    <MapComponent site={site} mapInstance={mapInstance} setMapInstance={setMapInstance} sites={filteredSites} setSite={setSite} />
                </Col>
            </Row>
        </div>
    );
}

export default Map
