import 'leaflet/dist/leaflet.css';
import 'react-leaflet-markercluster/styles';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import MarkerClusterGroup from "react-leaflet-markercluster";
import { useState, useEffect } from 'react';
import Icon from './Icon.jsx'
import axios from 'axios';
import './map.css';


function Map() {
    const [sites, setSites] = useState([]);

    useEffect(()=>{
        const fetchData = async () => {
            const {data:response} = await axios.get('http://localhost:3000/sites');
            setSites(response.sites);
        };
        fetchData().then(()=> {
            console.log("Map API request fulfilled");
        });
    },[]);

    const markers = [];
    sites.forEach((site, index)=>{
        if(site.latitude && site.longitude) {
            markers.push(
                <Marker
                    key={index}
                    icon={Icon(site)}
                    onclick={(e) => {
                        console.log(e);
                        console.log(site);
                        console.log("Hello world");
                    }}
                    position={[site.latitude, site.longitude]}/>
            );
        }
    });


    return (
        <MapContainer
            className="markercluster-map"
            center={[53.5, -7.3]}
            zoom={8}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MarkerClusterGroup
                showCoverageOnHover={false}
                disableClusteringAtZoom={16}
            >
                {markers}
            </MarkerClusterGroup>
        </MapContainer>
    );
}

export default Map
