import {Form, Col, Container, Row, FormSelect} from "react-bootstrap";
import React from "react";

function FilterComponent({siteTypes, typeFilters, setTypeFilters})
{
    return (<Container fluid>
        <Form>
            <Form.Group as={Row} className="mb-3" controlId="filterType">
                <Col>
                    <Form.Control
                        as="select"
                        multiple
                        value={typeFilters}
                        onChange={
                            e => {
                                const filters = [].slice.call(e.target.selectedOptions).map(item => item.value);
                                setTypeFilters(filters);
                            }
                        }
                    >
                        <option value="">- Filter on type - </option>
                        {siteTypes.map((type, index)=>
                            <option key={index} value={type}>{type}</option>
                        )}
                    </Form.Control>
                </Col>
            </Form.Group>
        </Form>
    </Container>);
}

export default React.memo(FilterComponent);