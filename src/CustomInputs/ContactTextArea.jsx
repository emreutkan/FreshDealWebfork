import { useField } from 'formik';
import React from 'react';

function ContactTextArea({ label, ...props }) {
    const [field, meta] = useField(props);

    return (
        <>
            <label className="form-label"> {label}</label>
            <textarea
                {...field}
                {...props}
            />

            {meta.error && <div style={{ color: "#fc8181" }}
            >{meta.error}</div>}
        </>
    );
}

export default ContactTextArea;
