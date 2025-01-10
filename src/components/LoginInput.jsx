import { useField } from 'formik';
import React from 'react';

function LoginInput({ label, ...props }) {
  const [field, meta] = useField(props);

  return (
    <>
      <label>{label}</label>
      {props.type === "tel" && (
        <select>
        <option value="+1">+1</option>
        <option value="+90">+90</option>
        <option value="+44">+44</option>
        </select>)
      }
      <input
        {...field}
        {...props}
        className={meta.error ? 'input-error' : ''}
      />

      {meta.error && <div className="error">{meta.error}</div>}
    </>
  );
}

export default LoginInput;
