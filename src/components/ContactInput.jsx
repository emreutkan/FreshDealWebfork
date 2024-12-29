import { useField } from 'formik';
import React from 'react';

function ContactInput({ label, ...props }) {
  const [field, meta] = useField(props);

  return (
    <>
      <label>{label}</label>
      <input
        {...field}
        {...props}
        className={`mail_text ${meta.error ? 'input-error' : ''}`}
      />

      {meta.error && <div className="error">{meta.error}</div>}
    </>
  );
}

export default ContactInput;
