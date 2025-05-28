import {Col, Container, Form, Row, Button} from "react-bootstrap";
import React from 'react';
import FormField from '../FormField.jsx';
import {client} from "../../tools/AxiosInterceptor.js";

function Register()
{
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [passwordConfirmation, setPasswordConfirmation] = React.useState('');
    const [email, setEmail] = React.useState("");
    const [displayName, setDisplayName] = React.useState("");
    const [validated, setValidated] = React.useState(false);
    const [errors, setErrors] = React.useState([]);

    const handleSubmit = async (e)=>{
        e.preventDefault();
        const newErrors = []
        if(password.length < 8)
        {
            newErrors.push("Password is too short");
        }
        if(password !== passwordConfirmation)
        {
            newErrors.push("Password strings don't match");
        }
        if(!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/))
        {
            newErrors.push("Email is invalid");
        }
        if(!displayName.match(/^[a-zA-Z0-9_-]{5,20}$/))
        {
            newErrors.push("Display names can only contain the letters a-z, upper and lower case, numbers and _ or - and must be between 5 and 20 (inclusive) characters.");
        }

        setErrors(newErrors);
        if(newErrors.length > 0)
        {
            return;
        }

        try
        {
            const response = await client.post('/users/register', {username, password, passwordConfirmation, email, displayName}, {headers: {'Content-Type': 'application/json'}});
            console.log(response);
            setErrors([]);
            setValidated(true);
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


    return (<Container>
        <h2 className="text-center">New Account Registration</h2>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
                <FormField id="username" field={username} setField={setUsername} label="Username" inputGroupPrefix="&#128100;"/>
            </Row>
            <Row className="mb-3">
                <FormField id="displayName" field={displayName} setField={setDisplayName} label="Display name" inputGroupPrefix="&#128100;"/>
            </Row>
            <Row className="mb-3">
                <FormField id="email" field={email} setField={setEmail} label="Email" inputGroupPrefix="@"/>
            </Row>
            <Row className="mb-3">
                <FormField id="password" field={password} setField={setPassword} type="password" label="Password" inputGroupPrefix="&#128477;"/>
                <FormField id="passwordConfirmation" field={passwordConfirmation} setField={setPasswordConfirmation} type="password" label="Confirm Password"  inputGroupPrefix="&#128477;"/>
            </Row>

            {errors.map((error, idx)=>(<Row className="error" key={idx}><Col>{error}</Col></Row>))}
            {validated ? (<Row>
                You have successfully registered and may now log in.
            </Row>):""}
            <Row>
                <Col>
                    <Button variant="primary" type="submit">Register</Button>
                </Col>
            </Row>
        </Form>
    </Container>);
}

export default Register;