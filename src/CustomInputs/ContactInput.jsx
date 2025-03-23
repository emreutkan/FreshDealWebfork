import { useField } from 'formik';
import React from 'react';

function ContactInput({ required, label, ...props }) {
    const [field, meta] = useField(props);

    return (
        <>
            <label className="form-label">
                {" "}
                {label}{required && <span className="text-danger">*</span>}
            </label>
            <input
                {...field}
                {...props}
            />

            {meta.error && <div style={{ color: "#fc8181" }}
            >{meta.error}</div>}
        </>
    );
}

export default ContactInput;
