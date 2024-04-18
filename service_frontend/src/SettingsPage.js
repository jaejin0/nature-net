import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SettingsPage.css';
import SettingsIcon from './settings.png';
import threatIcon from './threat.png'
import HomeIcon from './home.png';
import Logo from './logo.png';
import { useUser } from './UserContext';
import { googleLogout } from '@react-oauth/google';
import LivestreamIcon from './livestream.png';


function Settings() {
    const { profile, setProfile } = useUser();
    const [phoneNumber, setPhoneNumber] = useState('');
    const navigate = useNavigate();

    const logOut = () => {
        googleLogout();
        setProfile(null);
        navigate('/');
    };

    const formatPhoneNumber = (value) => {
        const numbers = value.replace(/\D/g, ''); // Remove all non-digits
        const char = { 0: '(', 3: ') ', 6: ' ' }; // Define desired formatting
        const phoneNumber = numbers.split('').map((number, index) => (char[index] ? char[index] + number : number)).join('');
        return phoneNumber.slice(0, 14); // Limit to 14 characters: (123) 456 7890
    };

    const handlePhoneNumberChange = (e) => {
        const formattedPhoneNumber = formatPhoneNumber(e.target.value);
        setPhoneNumber(formattedPhoneNumber);
    };

    const handleConfirm = async (event) => {
        event.preventDefault();
        // Additional logic for updating phone number or handling user settings
        console.log('Settings confirmed.');
        navigate('/logs');
    };

    return (
        <div className="title-settings">
            <img src={Logo} alt="Logo" className='logo'></img>
            <div className="title-space"></div>
            <div className="title-container"><h2 className="log-title">NatureNet</h2></div>
            <div className="icons-container">
                <img src={SettingsIcon} alt="Settings" className="nav-icon" />
                <img src={threatIcon} alt="Livestream" className="nav-icon" onClick={() => navigate('/livestream')} />
                <img src={HomeIcon} alt="Home" className='nav-icon' onClick={() => navigate('/logs')} />
            </div>
            <div className="settings-container">
                <h2 className="settings-title">Settings</h2>
                {profile && (
                    <p>Email: {profile.email}</p>
                )}
                <form className="settings-form" onSubmit={handleConfirm}>
                    <div className="input-group">
                        <label htmlFor="phoneNumber" className="input-label">Change Phone Number</label>
                        <input
                            type="text"
                            id="phoneNumber"
                            placeholder="(123) 456 7890"
                            value={phoneNumber}
                            onChange={handlePhoneNumberChange}
                            className="input-field"
                        />
                    </div>
                    <button type="submit" className="confirm-button">Confirm</button>
                    <button type="button" className="AccountDelete-button">DELETE ACCOUNT</button>
                    <button onClick={logOut} type="button" className="logout-button">Log out</button>
                </form>
            </div>
        </div>
    );
}

export default Settings;
