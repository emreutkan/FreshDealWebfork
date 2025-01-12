import './Popup.css'
import LoginPage from './LoginPage';
import Register from './components/Register'

function Popup({ openPopup, closePopup, popupType }) {
    return (
        popupType === "Login" ? (
            <div className="overlay" onClick={closePopup}>
            <div className="popup" onClick={(e) => e.stopPropagation()}>
              <LoginPage openPopup={openPopup} closePopup={closePopup} />
              <button onClick={closePopup}>Close</button>
            </div>
          </div>
        ) : (
            <div className="overlay" onClick={closePopup}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <Register openPopup={openPopup} closePopup={closePopup} />
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
        )
    );
}

export default Popup;