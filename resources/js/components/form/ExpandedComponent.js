import React from 'react';

export default ({data}) => <div dangerouslySetInnerHTML={{ __html:data.text }}></div>