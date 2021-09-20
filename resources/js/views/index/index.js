import { inject, observer } from 'mobx-react';
import React from 'react';
import Layout from '../../components/layout/front.layout';

const Index = (props) => {
    props.AuthStore.getToken();
    
    return (
        <Layout>
            <div>Burası Index</div>
        </Layout>
    )
}

export default inject("AuthStore")(observer(Index));