import { useField } from 'formik';
import React from 'react';

function LoginInput({ ...props }) {
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

export default LoginInput;
