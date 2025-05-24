import {Col, Container, Row} from "react-bootstrap";
import React from 'react';

function Details({site})
{
    if(site)
    {
        return (<Container fluid>
            <Row>
                <Col>{site.townland_name} - {site.classdesc}</Col>
            </Row>
        </Container>);
    }
    return '';
}

export default React.memo(Details);