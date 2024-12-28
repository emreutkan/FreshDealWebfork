import AccountShow from './AccountShow'
import './AccountList.css'
import { useContext } from 'react';
import AccountsContext from '../context/account';

function AccountList() {
const {accounts} = useContext(AccountsContext);

    return (
        <>
        <h1>Accounts</h1>
        <div className="account-list">
            {accounts.map((account, index) => {
                return (
                    <AccountShow key={index} account={account} />
                )
            })}
        </div>
        </>
    );
}

export default AccountList;