import { useState, useContext } from 'react';
import AccountsContext from '../context/account';
import Register from './Register';

function AccountShow({ account }) {
  const { /*deleteAccountById,*/ editAccountById } = useContext(AccountsContext);
  const [showEdit, setShowEdit] = useState(false)

  const handleDeleteClick = () => {
    //deleteAccountById(account.id)
  }

  const handleEditClick = () => {
    setShowEdit(!showEdit)
  }

  const handleSubmit = (id, updatedName, updatedEmail, updatedNumber, updatedPassword) => {
    setShowEdit(false)
    editAccountById(id, updatedName, updatedEmail, updatedNumber, updatedPassword)
  }

  return (
    showEdit ? (
      <Register account={account} accountFormUpdate={true} onUpdate={handleSubmit} />
    ) : (
      <div className="account-show">
        <h3 className="account-title">Full Name</h3 >
        <p>{account.name_surname}</p>
        <h3 className="account-title">E-mail</h3>
        <p>{account.email}</p>
        <h3 className="account-title">Phone Number</h3>
        <p>{account.phone_number}</p>
        <h3 className="account-title">Password</h3>
        <p>{account.password}</p>
        <div>
          <button className="account-delete" onClick={handleDeleteClick}>Delete</button>
          <button className="account-edit" onClick={handleEditClick}>Edit</button>
        </div>
      </div >
    )
  );
}

export default AccountShow;