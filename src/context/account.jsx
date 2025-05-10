import { createContext } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {getUserDataThunk, registerUserThunk} from "@src/redux/thunks/userThunks";

const AccountsContext = createContext();

function AccountProvider({ children }) {
  const [accounts, setAccounts] = useState([])
  const dispatch = useDispatch();
  useSelector(state => state.user);
  const handleRegister = async (name_surname, email, phone_number, password) => {
    try {
      const result = await dispatch(registerUserThunk({
        name_surname,
        email,
        phone_number,
        password,
      }));

      const registeredAccounts = [...accounts, result.payload];
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

  const fetchAccounts = async () => {
    try {
      const response = await dispatch(getUserDataThunk());
      setAccounts(response.payload);
    } catch (err) {
      console.error(err);
    }
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
