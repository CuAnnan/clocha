import {Col, Container, Form, Row, Button} from "react-bootstrap";
import React from 'react';
import FormField from '../FormField.jsx';
import {client} from "../../tools/AxiosInterceptor.js";
import accountValidator from './accountValidator.js';

function Account()
{
    const [user, setUser] = React.useState({});
    const [password, setPassword] = React.useState("");
    const [passwordConfirmation, setPasswordConfirmation] = React.useState('');
    const [email, setEmail] = React.useState("");
    const [displayName, setDisplayName] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [validated, setValidated] = React.useState(false);
    const [errors, setErrors] = React.useState([]);
    const [submitting, setSubmitting] = React.useState(false);

    React.useEffect(() => {
        (async ()=>{
            const user = await client.getUser();
            setUser(user);
            setDisplayName(user.displayName);
            setUsername(user.username);
            setEmail(user.email);
        })();
    },[]);

    const handleSubmit = async (e)=>{
        e.preventDefault();
        const newErrors = accountValidator({username, password, email, displayName});
        setErrors(newErrors);
        setSubmitting(true);
        if(newErrors.length > 0)
        {
            setSubmitting(false);
            return;
        }

        try
        {
            await client.patch('/users/account', {username, password, passwordConfirmation, email, displayName}, {headers: {'Content-Type': 'application/json'}});
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
        finally
        {
            setSubmitting(false);
        }

    }


    return (<Container>
        <h2 className="text-center">Account settings</h2>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
                <FormField id="username" field={user.username} disabled label="Username" inputGroupPrefix="&#128100;"/>
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
                    <Button variant="primary" type="submit" disabled={submitting}>
                        {submitting ? "Submitting..." : "Register"}
                    </Button>
                </Col>
            </Row>
        </Form>
    </Container>);
}

export default Account;