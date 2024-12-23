import { useState, useEffect } from 'react';
import './Register.css'
import AccountList from './AccountList';
import axios from 'axios';

function Register({ account, accountFormUpdate, onUpdate/*, onDelete*/ }) {
    const [name_surname, setName] = useState(account ? account.name_surname : '');
    const [email, setEmail] = useState(account ? account.email : '');
    const [phone_number, setNumber] = useState(account ? account.phone_number : '');
    const [password, setPassword] = useState(account ? account.password : '');

    const [accounts, setAccounts] = useState([])

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

    const fetchAccounts = async () => {
        const response = await axios.get('https://freshdealapi-fkfaajfaffh4c0ex.uksouth-01.azurewebsites.net/v1/register');
        debugger;//database denemesi
        setAccounts(response.data);
      }

    const handleRegister = async (name_surname, email, phone_number, password) => {
try {
    const response = await axios.post('https://freshdealapi-fkfaajfaffh4c0ex.uksouth-01.azurewebsites.net/v1/register', {
        name_surname,
        email,
        phone_number,
        password,
      })
      console.log(response)
      const registeredAccounts = [...accounts, response.data];
      setAccounts(registeredAccounts);
} catch(err) {
    console.log(err.message)
} 
      }

    const editAccountById = (id, updatedName, updatedEmail, updatedNumber, updatedPassword) => {
        const updatedAccount = accounts.map((account) => {
          if (account.id === id) {
            return {
              id,
              name_surname: updatedName,
              email: updatedEmail,
              phone_number: updatedNumber,
              password: updatedPassword,
            };
          }
          return account;
        })
        setAccounts(updatedAccount)
      }

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
    <AccountList accounts={accounts} /*onDelete={onDelete}*/ onUpdate={editAccountById} />
    </>
    );
}

export default Register;