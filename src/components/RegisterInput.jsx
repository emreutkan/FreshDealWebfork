import { useField } from 'formik';
import React from 'react';

function RegisterInput({ label, ...props }) {
  const [field, meta] = useField(props);

  return (
    <>
      <label className="register-label">{label}</label>
      {props.id === "phone" && (
        <select>
        <option value="+1">+1</option>
        <option value="+90">+90</option>
        <option value="+44">+44</option>
        </select>)
      }
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
