import { createContext } from 'react';
import { useState } from 'react';
import axios from 'axios';

const AccountsContext = createContext();

function AccountProvider({ children }) {
const [accounts, setAccounts] = useState([])

const handleRegister = async (name_surname, email, phone_number, password) => {
  try {
      const response = await axios.post('https://freshdealbackend.azurewebsites.net/v1/register', {
          name_surname,
          email,
          phone_number,
          password,
        })
        
        const registeredAccounts = [...accounts, response.data];
        setAccounts(registeredAccounts);
  } catch(err) {
      console.log(err.message)
  } 
        }

/*const deleteAccountById = (id) => {
    const response = await axios.delete('https://freshdealbackend.azurewebsites.net/v1/register');
    const afterDeletingAccount = accounts.filter((account) => {
      return account.id !== id;
    })
    setAccounts(afterDeletingAccount)
  }*/

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

  const fetchAccounts = async () => {
    const response = await axios.get('https://freshdealbackend.azurewebsites.net/v1/register');//burasi degisecek
    debugger;//database denemesi
    setAccounts(response.data);
  }

  const sharedValuesAndMethods = {
    accounts,
    handleRegister,
    fetchAccounts,
    editAccountById,
    //deleteAccountById,
  };

  return (
    <AccountsContext.Provider value={sharedValuesAndMethods}>
      {children}
    </AccountsContext.Provider>
  );
}

export { AccountProvider };
export default AccountsContext;
