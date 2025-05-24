import {MapContainer, Marker, TileLayer} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import Icon from './Icon.jsx'
import React, { useMemo } from 'react';

function MapComponent({sites, setSite})
{
    const markers = useMemo(() => sites
        .filter(site => Number.isFinite(site.latitude) && Number.isFinite(site.longitude))
        .map((site, idx) => (
            <Marker
                key={idx}
                icon={Icon(site)}
                position={[site.latitude, site.longitude]}
                eventHandlers={{
                    click: () => setSite(site),
                }}
            />
        )), [sites, setSite]);


    return (
        <MapContainer
            className="markercluster-map"
            center={[53.35, -7.3]}
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
        </MapContainer>);
}

export default React.memo(MapComponent);