import React from 'react';

const CustomInput = (props) => {
    return (
        <input className="form-control mt-3"
            {...props}
        />
    );
}

export default CustomInput;