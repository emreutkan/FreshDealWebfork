import { useState, useEffect, useContext } from 'react';
import AccountsContext from '../context/account';
import './Register.css'
import AccountList from './AccountList';

function Register({ account, accountFormUpdate, onUpdate }) {
    const [name_surname, setName] = useState(account ? account.name_surname : '');
    const [email, setEmail] = useState(account ? account.email : '');
    const [phone_number, setNumber] = useState(account ? account.phone_number : '');
    const [password, setPassword] = useState(account ? account.password : '');

    const { handleRegister, fetchAccounts } = useContext(AccountsContext);
    useEffect(() => {
        fetchAccounts();
    }, [])

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleNumberChange = (event) => {
        setNumber(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event) => {
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
    };

    return (
    <>
    {
        accountFormUpdate ? (
            <div className="account-update">
                <h3>Edit Account</h3>
                <form className="register-form">
                    <label className="register-label">New Full Name:</label>
                    <input value={name_surname} onChange={handleNameChange} className="register-input" />
                    <label className="register-label">New E-mail:</label>
                    <input value={email} onChange={handleEmailChange} className="register-input" />
                    <label className="register-label">New Phone:</label>
                    <input value={phone_number} onChange={handleNumberChange} className="register-input" />
                    <label className="register-label">New Password:</label>
                    <input value={password} onChange={handlePasswordChange} className="register-input" />
                    <button className="register-button update-button" onClick={handleSubmit}>Update</button>
                </form>
            </div >
        ) : (
            <div className="register">
                <h3>Register Account</h3>
                <form className="register-form">
                    <label className="register-label">Full Name:</label>
                    <input value={name_surname} onChange={handleNameChange} className="register-input" />
                    <label className="register-label">E-mail:</label>
                    <input value={email} onChange={handleEmailChange} className="register-input" />
                    <label className="register-label">Phone:</label>
                    <input value={phone_number} onChange={handleNumberChange} className="register-input" />
                    <label className="register-label">Password:</label>
                    <input value={password} onChange={handlePasswordChange} className="register-input" />
                    <button className="register-button" onClick={handleSubmit}>Register</button>
                </form>
            </div >
        )
    }
    <AccountList />
    </>
    );
}

export default Register;