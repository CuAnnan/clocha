import { Col, Container, Form, Row, Button } from "react-bootstrap";
import React, { useState } from 'react';
import FormField from '../FormField.jsx';
import { client } from "../../tools/AxiosInterceptor.js";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        setValidated(false);

        if (username && password) {
            try
            {
                await client.login(username, password);
                window.location.href = "/";
            }
            catch (err)
            {
                const responseErrors = err.response?.data?.errors || ['Login failed. Please try again.'];
                setErrors(responseErrors);
                setValidated(false);
            }
        } else {
            setErrors(['Username and password are required.']);
        }
    };

    return (
        <Container>
            <h2 className="text-center">Login</h2>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <FormField
                        id="username"
                        field={username}
                        setField={setUsername}
                        label="Username"
                        inputGroupPrefix="&#128100;"
                    />
                </Row>
                <Row className="mb-3">
                    <FormField
                        id="password"
                        field={password}
                        setField={setPassword}
                        label="Password"
                        type="password"
                        inputGroupPrefix="&#128477;"
                    />
                </Row>
                <Row>
                    <Col>
                        <Button variant="primary" type="submit">Login</Button>
                    </Col>
                </Row>
                {errors.map((error, idx) => (
                    <Row key={idx} className="mb-3 error">
                        <Col>{error}</Col>
                    </Row>
                ))}
            </Form>
        </Container>
    );
}

export default Login;