import { useField } from 'formik';
import React from 'react';

function RegisterInput({ label, ...props }) {
  const [field, meta] = useField(props);

  return (
    <>
      <label className="register-label">{label}</label>
      <input
        {...field}
        {...props}
        className={`register-input ${meta.error ? 'input-error' : ''}`}
      />

      {meta.error && <div className="error">{meta.error}</div>}
    </>
  );
}

export default RegisterInput;
