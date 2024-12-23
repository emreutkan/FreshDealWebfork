import AccountShow from './AccountShow'
import './AccountList.css'

function AccountList({ accounts, onDelete, onUpdate }) {
    return (
        <>
        <h1>Accounts</h1>
        <div className="account-list">
            {accounts.map((account, index) => {
                return (
                    <AccountShow key={index} account={account} onDelete={onDelete} onUpdate={onUpdate} />
                )
            })}
        </div>
        </>
    );
}

export default AccountList;