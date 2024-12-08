import { useState } from 'react';
import './LoginPage.css'

function LoginPage({login}) {

const [email, setEmail] = useState('')
const [password, setPassword] = useState('')

const handleEmailChange = (event) => {
    setEmail(event.target.value);
}

const handlePasswordChange = (event) => {
    setPassword(event.target.value);
}

const handleFormSubmit = (event) => {
    event.preventDefault();
    debugger;
    login(email, password)
}

    return ( 
        <div className="loginDiv">
            <form onSubmit={handleFormSubmit}>
                <label>E-mail:</label>
                <input value={email} onChange={handleEmailChange} />
                <label>Password:</label>
                <input value={password} onChange={handlePasswordChange} />
                <button type='submit'>submit</button>
            </form>
        </div>
     );
}

export default LoginPage