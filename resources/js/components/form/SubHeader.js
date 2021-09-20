import React from 'react';

const SubHeader = (props) => {
    return (
        <div className={"d-flex"}>
            <input type="text" className={"form-control"} style={{ flex:1, marginRight:"5px" }} placeholder={"Ara"} onChange={props.filter}/>
            <button className = {props.action.class} onClick={props.action.uri}>{props.action.title}</button>
   
        </div>
     );
}

export default SubHeader;