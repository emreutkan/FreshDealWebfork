import { useField } from 'formik';
import React from 'react';

function RegisterInput({ ...props }) {
    const [field, meta] = useField(props);

    return (
        <>
            <input
                {...props}
                {...field}
            />
            {meta.error && <div style={{ color: "#fc8181" }}
            >{meta.error}</div>}
        </>
    );
}

export default RegisterInput;
