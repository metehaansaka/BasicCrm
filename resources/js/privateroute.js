import React from 'react';
import { Redirect, Route, withRouter } from 'react-router-dom';
import AuthStore from './store/AuthStore';

AuthStore.getToken();
const isLoggedIn = AuthStore.appState != null && AuthStore.appState.isLoggedIn;

const PrivateRoute = ({
    component:Component,
    path,
    ...rest
}) => (
    <Route path={path} {...rest}
    render = {
        props => isLoggedIn ? (
            <Component {...props} />
        ) : (
            <Redirect to={{ 
                pathname :"/login",
                state:{
                    prevLocation:path,
                    error: "Giriş Yapılmadı"
                }
            }} />
        )
    }
    />
)

export default withRouter(PrivateRoute);