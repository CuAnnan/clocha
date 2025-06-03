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

    const filteredSites =  typeFilters.length > 0
        ? sites.filter(site => {
            return typeFilters.includes(site.properties.type)
        }) // Adjust 'site.type' if needed
        : sites;

    return (
        <div className="map-wrapper">
            <Row className="h-100 gx-0"> {/* gx-0 removes gutters */}
                <Col md={2} className="bg-light d-none d-md-block accordion">
                    <Accordion defaultActiveKey="0">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Filters</Accordion.Header>
                            <Accordion.Body>
                                <FilterComponent siteTypes={siteTypes} typeFilters={typeFilters} setTypeFilters={setTypeFilters} />
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
                <Col className="h-100">
                    <MapComponent sites={filteredSites} setSite={setSite} />
                </Col>
            </Row>
        </div>
    );
}

export default Map
