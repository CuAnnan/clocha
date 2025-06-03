import { MapContainer, Marker, TileLayer, useMapEvent } from "react-leaflet";
import useSupercluster from "use-supercluster";
import React, { useEffect, useState } from "react";
import Icon from "./Icon.jsx";
import L from "leaflet";
import LocationComponent from "./LocationComponent.jsx";


import { useMap } from "react-leaflet";

function MapControl({ onMapReady }) {
    const map = useMap();
    useEffect(() => {
        onMapReady(map);
    }, [map, onMapReady]);
    return null;
}


function MapUpdater({ setBounds, setZoom }) {
    const map = useMapEvent("moveend", () => {
        const bounds = map.getBounds();
        setBounds([
            bounds.getSouthWest().lng,
            bounds.getSouthWest().lat,
            bounds.getNorthEast().lng,
            bounds.getNorthEast().lat,
        ]);
        setZoom(map.getZoom());
    });

    useMapEvent("zoomend", () => {
        setZoom(map.getZoom());
    });

    useEffect(() => {
        const bounds = map.getBounds();
        setBounds([
            bounds.getSouthWest().lng,
            bounds.getSouthWest().lat,
            bounds.getNorthEast().lng,
            bounds.getNorthEast().lat,
        ]);
        setZoom(map.getZoom());
    }, [map, setBounds, setZoom]);

    return null;
}

function MapComponent({site, sites, setSite, setMapInstance, mapInstance }) {
    const [bounds, setBounds] = useState(null);
    const [zoom, setZoom] = useState(8);

    const { clusters, supercluster } = useSupercluster({
        points: sites,
        bounds,
        zoom,
        options: { radius: 100, maxZoom: 20 },
    });

    const iconsRef = React.useRef({});
    const fetchIcon = (count, size) => {
        if (!iconsRef.current[count]) {
            iconsRef.current[count] = L.divIcon({
                html: `<div class="cluster-marker">${count}</div>`,
                className: "cluster-icon",
                iconSize: [size, size],
            });
        }
        return iconsRef.current[count];
    };

    return (
        <MapContainer
            className="markercluster-map"
            center={[53.35, -7.3]}
            zoom={8}
            style={{ height: "100vh", width: "100%" }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Set map instance */}
            <MapControl onMapReady={setMapInstance} />
            <MapUpdater setBounds={setBounds} setZoom={setZoom} />
            <LocationComponent zoom={zoom}/>

            {clusters.map((cluster) => {
                const [longitude, latitude] = cluster.geometry.coordinates;
                const {
                    cluster: isCluster,
                    point_count: pointCount,
                } = cluster.properties;

                if (isCluster) {
                    return (
                        <Marker
                            key={`cluster-${cluster.id}`}
                            position={[latitude, longitude]}
                            icon={fetchIcon(pointCount, 30)}
                            eventHandlers={{
                                click: () => {
                                    const expansionZoom = Math.min(
                                        supercluster.getClusterExpansionZoom(cluster.id),
                                        20
                                    );
                                    mapInstance.setView([latitude, longitude], expansionZoom);
                                },
                            }}
                        />
                    );
                }

                return (
                    <Marker
                        key={`poi-${cluster.properties.smrs}`}
                        position={[latitude, longitude]}
                        icon={Icon(cluster.properties, site?.smrs===cluster.properties.smrs)}
                        eventHandlers={{
                            click: (e) => {
                                setSite(cluster.properties);
                            },
                        }}
                    />
                );
            })}
        </MapContainer>
    );
}


export default React.memo(MapComponent);
