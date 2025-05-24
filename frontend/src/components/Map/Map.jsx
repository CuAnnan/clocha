import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/styles';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import MarkerClusterGroup from "react-leaflet-markercluster";
import { useState, useEffect } from 'react';
import {Row, Col, Container} from 'react-bootstrap';
import axios from 'axios';
import MapComponent from "./MapComponent.jsx";
import DetailsComponent from "./DetailsComponent.jsx";

import './map.css';



function Map() {
    const [sites, setSites] = useState([]);
    const [site, setSite] = useState(null);

    useEffect(()=>{
        const fetchData = async () => {
            const {data:response} = await axios.get('http://localhost:3000/sites');
            setSites(response.sites);
        };
        fetchData().then(()=> {
            console.log("Map API request fulfilled");
        });
    },[]);




    return (
        <div className="map-wrapper">
            <Row className="h-100 gx-0"> {/* gx-0 removes gutters */}
                <Col md={2} className="bg-light d-none d-md-block">
                    <DetailsComponent site={site}/>
                </Col>
                <Col className="h-100">
                    <MapComponent sites={sites} setSite={setSite} />
                </Col>
            </Row>
        </div>
    );
}

export default Map
