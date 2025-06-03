import React, { useEffect, useState } from "react";
import {Marker } from "react-leaflet";
import L from 'leaflet';

function createRotatedIcon(heading, zoom) {
    const maxZoom = 19;
    const minZoom = 5;
    const minSize = 8;
    const maxSize = 48;
    const zoomRange = maxZoom - minZoom;
    const clampedZoom = Math.min(Math.max(zoom, minZoom), maxZoom);
    const size = minSize + ((clampedZoom - 5) / zoomRange) * (maxSize - minSize);
    const halfSize = size / 2;

    return L.divIcon({
        html: `<div style="transform: rotate(${heading ?? 0}deg);">
                <svg width="${size}" height="${size}" viewBox="0 0 24 24" >
                    <circle cx="12" cy="12" r="12" fill="blue" opacity="0.7" />
                    <path 
                        d="M12 4 L18 20 L12 16 L6 20 Z" 
                        fill="white" 
                        stroke="none"
                    />
                </svg>
           </div>`,
        className: "custom-position-icon",
        iconSize: [size, size],
        iconAnchor: [halfSize, halfSize],
    });
}



function LocationComponent({zoom}) {
    const [position, setPosition] = useState(null);
    const [heading, setHeading] = useState(0);

    useEffect(() => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        const watcher = navigator.geolocation.watchPosition(
            (pos) => {
                setPosition([pos.coords.latitude, pos.coords.longitude]);
                if (pos.coords.heading !== null && pos.coords.heading !== undefined) {
                    setHeading(pos.coords.heading);
                } else {
                    setHeading(0); // fallback heading
                }
            },
            (err) => console.error(err),
            {
                enableHighAccuracy: true,
                maximumAge: 10000,
                timeout: 15000,
            }
        );

        return () => navigator.geolocation.clearWatch(watcher);
    }, []);

    if (!position) return null; // or a loader

    return (
        <Marker
            position={position}
            icon={createRotatedIcon(heading, zoom)}
        />
    );
}

export default LocationComponent;
