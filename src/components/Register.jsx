import { useState, useEffect, useContext } from 'react';
import { Form, Formik } from 'formik';
import AccountsContext from '../context/account';
import './Register.css'
import AccountList from './AccountList';
import { registerSchema } from '../schemas';
import RegisterInput from './RegisterInput';

const onSubmit = async (values, actions) => {
    await new Promise((resolve)=>{
        setTimeout(resolve, 1000)
    })
    actions.resetForm();
}

function Register({ account, accountFormUpdate, onUpdate }) {
    

    const { handleRegister, fetchAccounts } = useContext(AccountsContext);
    useEffect(() => {
        fetchAccounts();
    }, [])

    /*const handleSubmit = (event) => {
        event.preventDefault();
        if (accountFormUpdate) {
            onUpdate(account.id, name_surname, email, phone_number, password)
        }
        else {
            handleRegister(name_surname, email, phone_number, password);
        }
        setName('');
        setEmail('');
        setNumber('');
        setPassword('');
    };*/

    return (
    <>
    {
        accountFormUpdate ? (
            <div className="account-update">
                <h3>Edit Account</h3>
                <Formik
                        initialValues={{
                            name_surname: account ? account.name_surname : '',
                            email: account ? account.email : '',
                            phone: account ? account.phone_number : '',
                            password: '',
                            confirmPassword: ''
                        }}
                        onSubmit={onSubmit}
                        validationSchema={registerSchema}
                     >
                        {({ isSubmitting }) => (
                           <Form className="register-form">
                            <RegisterInput
                                    label="Full Name:"
                                    id="name_surname"
                                    name="name_surname"
                                 />
                                 <RegisterInput
                                    label="E-mail:"
                                    id="email"
                                    name="email"
                                 />
                                 <RegisterInput
                                    label="Phone:"
                                    id="phone"
                                    name="phone"
                                 />
                                 <RegisterInput
                                    label="Password:"
                                    id="password"
                                    name="password"
                                 />
                                 <RegisterInput
                                    label="Confirm Password:"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                 />
                    <button disabled={isSubmitting} className="register-button update-button">Update</button>
                           </Form>
                        )}
                     </Formik>
            </div >
        ) : (
            <div className="register">
                <h3>Register Account</h3>
                <Formik
                        initialValues={{
                            name_surname: account ? account.name_surname : '',
                            email: account ? account.email : '',
                            phone: account ? account.phone_number : '',
                            password: '',
                            confirmPassword: ''
                        }}
                        onSubmit={onSubmit}
                        validationSchema={registerSchema}
                     >
                        {({ isSubmitting }) => (
                           <Form className="register-form">
                            <RegisterInput
                                    label="Full Name:"
                                    id="name_surname"
                                    name="name_surname"
                                 />
                                 <RegisterInput
                                    label="E-mail:"
                                    id="email"
                                    name="email"
                                 />
                                 <RegisterInput
                                    label="Phone:"
                                    id="phone"
                                    name="phone"
                                 />
                                 <RegisterInput
                                    label="Password:"
                                    id="password"
                                    name="password"
                                 />
                                 <RegisterInput
                                    label="Confirm Password:"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                 />
                    <button disabled={isSubmitting} className="register-button" type='submit'>Register</button>
                           </Form>
                        )}
                     </Formik>
            </div >
        )
    }
    <AccountList />
    </>
    );
}

export default Register;