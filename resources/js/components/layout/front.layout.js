import React, { useState, useEffect } from "react";
import axios from 'axios';
import {inject, observer} from 'mobx-react';
import { Navbar , Nav , NavDropdown , Container , Button  ,Form} from 'react-bootstrap';
import {useHistory} from 'react-router-dom';

const Layout = (props) => {
    const [user, setUser] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    props.AuthStore.getToken();
    const history = useHistory();

    useEffect(()=>{
        const token = (props.AuthStore.appState != null ) ? props.AuthStore.appState.user.access_token : null;
        axios.post('/api/authenticate',{},{
            headers:{
                Authorization: 'Bearer '+ token
            }
        }).then((res) => {
            if(!res.data.isLoggedIn){
                history.push('/login');
            }
            setUser(res.data.user);
            setIsLoggedIn(res.data.isLoggedIn);
        }).catch(e => {
            history.push('/login');
        });
    },[]);

    const logout = () => {
        axios.post('/api/logout',{},{
            headers:{
                Authorization: 'Bearer '+ props.AuthStore.appState.user.access_token
            }
        }).then(res => console.log(res)).catch(e => console.log(e));
        props.AuthStore.removeToken();
        history.push("/login");
    }
    
    return (
        <>
            <Navbar bg="dark" expand="lg" variant="dark">
                <Container>
                    <Navbar.Brand>CRM</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">Yönetim Paneli</Nav.Link>
                        <Nav.Link href="/products">Ürünler</Nav.Link>
                    </Nav>
                    <Nav>
                        <NavDropdown title={user.name} id="basic-nav-dropdown">
                            <NavDropdown.Item href="#">Profili Düzenle</NavDropdown.Item>
                            <NavDropdown.Item href="#">Şifre Değiştir</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={logout}>Çıkış</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div>{props.children}</div>
        </>
    )
}

export default inject("AuthStore")(observer(Layout)) ;