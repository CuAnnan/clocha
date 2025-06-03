import {Col, Container, Row} from "react-bootstrap";
import React from 'react';

function Details({site})
{
    let details = null;
    if(site)
    {
        const siteName = encodeURIComponent(encodeURIComponent(`${site.townland_name} - ${site.classdesc}`));
        const googleURL = `https://www.google.com/maps/search/?api=1&query=${site.latitude},${site.longitude}`;
        const openMapsURL = `https://www.openstreetmap.org/?mlat=${site.latitude}&mlon=${site.longitude}&zoom=12`
        const appleMapsURL = `https://maps.apple.com/?ll=${site.latitude},${site.longitude}&q=${siteName}`;

        details = (<Container fluid>
            <Row>
                <Col>{site.townland_name} - {site.classdesc}</Col>
            </Row>
            <Row>
                <Col>
                    Links:
                    <ul>
                        <li><a href={openMapsURL} target="_BLANK">Open Maps</a></li>
                        <li><a href={googleURL} target="_BLANK">Google Maps</a></li>
                        <li><a href={appleMapsURL} target="_BLANK">Apple Maps</a></li>
                    </ul>
                </Col>
            </Row>
        </Container>);
    }
    return <>
        {details}
    </>;
}

export default React.memo(Details);