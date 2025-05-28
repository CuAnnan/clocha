import {Col, Container, Row} from "react-bootstrap";
import React from 'react';

function Details({site})
{
    let details = null;
    if(site)
    {
        details = (<Container fluid>
            <Row>
                <Col>{site.townland_name} - {site.classdesc}</Col>
            </Row>
        </Container>);
    }
    return <>
        {details}
    </>;
}

export default React.memo(Details);