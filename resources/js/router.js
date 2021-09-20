import React from 'react';
import {Route, Switch} from 'react-router-dom';
import FrontIndex from './views/index';
import FrontLogin from './views/login';
import FrontRegister from './views/register';
import PrivateRoute from './privateroute';
import ProductIndex from './views/products/index';
import ProductCreate from './views/products/create';
import ProductEdit from './views/products/edit';

const Main = () => (
    <Switch>
        <PrivateRoute exact path="/" component={FrontIndex} />
        <Route path="/login" component={FrontLogin} />
        <Route path="/register" component={FrontRegister} />
        <PrivateRoute exact path="/products" component={ProductIndex} />
        <PrivateRoute path="/products/create" component={ProductCreate} />
        <PrivateRoute path="/products/edit/:id" component={ProductEdit} />
    </Switch>
)

export default Main;