import { useField } from 'formik';
import React from 'react';

function ContactTextArea({ label, ...props }) {
  const [field, meta] = useField(props);

  return (
    <>
      <label>{label}</label>
      <textarea
        {...field}
        {...props}
        className={`message-bt ${meta.error ? 'input-error' : ''}`}
      />

      {meta.error && <div className="error">{meta.error}</div>}
    </>
  );
}

export default ContactTextArea;
