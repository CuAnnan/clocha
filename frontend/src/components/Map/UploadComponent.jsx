import {Form, Col, Container, Row,  Button} from "react-bootstrap";
import React from "react";
import {client} from "../../tools/AxiosInterceptor.js";

function UploadComponent({site})
{
    const [images, setImages] = React.useState([]);

    if(!site)
    {
        return <></>;
    }

    return (
        <Container fluid>
            <Form onSubmit={async (e)=>{
                e.preventDefault();
                try
                {
                    const formData = new FormData();
                    formData.append('site', JSON.stringify(site));
                    for(let image of images)
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
                                setImages(e.target.files);
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

export default UploadComponent;