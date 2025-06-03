import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import {client} from "../tools/AxiosInterceptor.js";

function Layout()
{
    const userSections = [];
    const [user, setUser] = React.useState({});
    React.useEffect(() => {
        (async ()=>{
            setUser(await client.getUser());
        })();
    });



    //const linkSections = [];

    const logout = (e)=>{
        e.preventDefault();
        client.clearTokens();
        window.location.reload();
    }

    if(user)
    {
        userSections.push(<Link to="/account"  className="nav-link"  key="2">Account</Link> );
        userSections.push(<Link to="#" key="1" className="nav-link" onClick={logout}>Logout ({user.username})</Link>);
    }
    else
    {
        userSections.push(<Link key="1" to="/register" className="nav-link">Register</Link>);
        userSections.push(<Link key="2" to="/login" className="nav-link">Login</Link>);
    }

    return ( <div className="container-fluid full-height-layout">
        <header>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand>Clocha V2</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Link to="/" className="nav-link">Home</Link>
                            <Link to="/map" className="nav-link">Map</Link>
                        </Nav>
                        <Nav className="ml-auto">
                            {userSections}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
        <main className="fill-remaining">
            <Outlet />
        </main>
    </div>);
}

export default Layout;