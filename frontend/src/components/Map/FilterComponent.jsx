import {Form, Col, Container, Row, FormSelect} from "react-bootstrap";
import React from "react";
import { Typeahead } from 'react-bootstrap-typeahead';

function FilterComponent({siteTypes, setSite, typeFilters, setTypeFilters, sites, mapInstance})
{


    return (<Container fluid>
        <Form>
            <Form.Group as={Row} className="mb-3" controlId="search">
                <Col>
                    <Form.Label column sm={2}>Search</Form.Label>
                    <Typeahead
                        labelKey={(option) => `${option.properties.townland_name} - ${option.properties.smrs}`}
                        options={sites}
                        filterBy={['smrs', 'townland']} onChange={(selected)=>{
                            console.log(selected[0]);
                            mapInstance.flyTo(selected[0].properties.location, 15);
                            setSite(selected[0].properties);
                        }}/>
                </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="filterType">
                <Col>
                    <Form.Label column sm={2} className="fw-bold">Filter</Form.Label>
                    <Form.Control
                        as="select"
                        multiple
                        value={typeFilters}
                        onChange={
                            e => {
                                const filters = Array.from(e.target.selectedOptions, item => item.value);
                                setTypeFilters(filters);
                            }
                        }
                    >
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