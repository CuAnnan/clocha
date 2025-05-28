import {Col, Container, Form, Row, Button} from "react-bootstrap";
import React, {useState} from 'react';
import FormField from '../FormField.jsx';
import {client} from "../../tools/AxiosInterceptor.js";

function Login()
{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState([]);

    const handleSubmit = async (e)=>{
        e.preventDefault();
        console.log(username, password);
        if(username && password)
        {
            const response = await client.post('/users/login', {username, password}, {headers: {'Content-Type': 'application/json'}});
            try
            {
                const {accessToken, refreshToken, user} = response.data;
                client.accessToken = accessToken;
                client.refreshToken = refreshToken;
                client.user = user;
                window.location.href="/";
            }
            catch(err)
            {
                const responseErrors = [];
                setValidated(false);
                for(let error of err.response.data.errors)
                {
                    responseErrors.push(error);
                }
                setErrors(responseErrors);
            }
        }
    };

    return (<Container>
        <h2 className="text-center">New Account Registration</h2>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
                <FormField id="username" field={username} setField={setUsername} label="Username" inputGroupPrefix="&#128100;"/>
            </Row>
            <Row className="mb-3">
                <FormField id="username" field={password} setField={setPassword} label="Username" type="password" inputGroupPrefix="&#128477;"/>
            </Row>
            <Row>
                <Col>
                    <Button variant="primary" type="submit">Login</Button>
                </Col>
            </Row>
            {errors.map((error, idx)=>{
                return (<Row key={idx} className="mb-3 error">{error}</Row>)
            })}
        </Form>
    </Container>);
}

export default Login;