import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/styles';
import { useState, useEffect } from 'react';
import {Row, Col} from 'react-bootstrap';

import MapComponent from "./MapComponent.jsx";
import DetailsComponent from "./DetailsComponent.jsx";
import FilterComponent from "./FilterComponent.jsx";
import UploadComponent from "./UploadComponent.jsx";

import POILoader from "../../tools/POILoader.js";

import './map.css';



function Map() {
    const [sites, setSites] = useState([]);
    const [site, setSite] = useState(null);
    const [siteTypes, setSiteTypes] = useState([]);

    useEffect(()=>{
        const fetchData = async () => {
            const updatedSites = await POILoader.fetchPOI({});
            setSites(updatedSites);
            setSiteTypes(POILoader.getSiteTypes());
        };
        fetchData().then(()=> {
            console.log("Map API request fulfilled");
        });
    },[]);

    return (
        <div className="map-wrapper">
            <Row className="h-100 gx-0"> {/* gx-0 removes gutters */}
                <Col md={2} className="bg-light d-none d-md-block">
                    <FilterComponent siteTypes={siteTypes}/>
                    <DetailsComponent site={site}/>
                    <UploadComponent site={site}/>
                </Col>
                <Col className="h-100">
                    <MapComponent sites={sites} setSite={setSite} />
                </Col>
            </Row>
        </div>
    );
}

export default Map
