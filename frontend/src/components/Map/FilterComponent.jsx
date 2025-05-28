import {Form, Col, Container, Row, FormSelect} from "react-bootstrap";
import React from "react";

function FilterComponent({siteTypes})
{
    return (<Container fluid>
        <h2>Filter search:</h2>
        <Form>
            <Form.Group as={Row} className="mb-3" controlId="filterType">
                <Col>
                    <FormSelect multiple>
                        <option value="">- Filter on type - </option>
                        {Object.keys(siteTypes).sort().map((type, index)=>
                            <option key={index} value={type}>{type}</option>
                        )}
                    </FormSelect>
                </Col>
            </Form.Group>
        </Form>
    </Container>);
}

export default React.memo(FilterComponent);