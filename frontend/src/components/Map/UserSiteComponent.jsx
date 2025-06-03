import {Form, Col, Container, Row,  Button} from "react-bootstrap";
import React from "react";
import {client} from "../../tools/AxiosInterceptor.js";

function UserSiteComponent({site})
{
    const [newImages, setNewImages] = React.useState([]);

    if(!client.user || !site)
    {
        return <></>;
    }



    return (
        <Container fluid>
            <Row>
                <Col>
                    <Button variant="primary" size="lg" onClick={() => {
                        console.log("Mark favourite")
                    }}>Mark favourite</Button>
                </Col>
            </Row>
            <h2>Add Photos</h2>
            <Form onSubmit={async (e)=>{
                e.preventDefault();
                try
                {
                    const formData = new FormData();
                    formData.append('site', JSON.stringify(site));
                    for(let image of newImages)
                    {
                        formData.append("images", image);
                    }
                    let response = await client.post('/sites/images', formData);
                    console.log(response);
                }
                catch(err)
                {
                    console.log(err);
                }
            }}>
                <Form.Group as={Row} className="mb-3" controlId="filterType">
                    <Col>
                        <Form.Group className="mb-3" controlId="fileUpload">
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="file" multiple onChange={(e)=>{
                                setNewImages(e.target.files);
                            }}/>
                        </Form.Group>
                    </Col>
                </Form.Group>
                <Row>
                    <Col>
                        <Button variant="primary" type="submit">Upload</Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}

export default UserSiteComponent;