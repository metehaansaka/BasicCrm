import React,{ Component } from 'react';
import ReactDOM from 'react-dom';
import Main from './router';
import {BrowserRouter, Route} from 'react-router-dom';
import { Provider } from "mobx-react";
import store from './store';

class Index extends Component{
    render(){   
        return (
            <Provider { ...store }>
            <BrowserRouter>
                <Route component={Main} />
            </BrowserRouter>
            </Provider>
        )   
    }
}

ReactDOM.render(<Index/>,document.getElementById('index'));