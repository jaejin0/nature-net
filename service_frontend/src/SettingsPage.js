import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SettingsPage.css';
import SettingsIcon from './settings.png';
import threatIcon from './threat.png'
import HomeIcon from './home.png';
import Logo from './logo.png';
import { useUser } from './UserContext';
import { googleLogout } from '@react-oauth/google';
import axios from 'axios';


function Settings() {
    const { profile, setProfile } = useUser();
    const [phoneNumber, setPhoneNumber] = useState('');
    const navigate = useNavigate();

    const logOut = () => {
        googleLogout();
        setProfile(null);
        navigate('/');
    };

    const handlePhoneNumberChange = (e) => {
        setPhoneNumber(e.target.value);
    };

    const toPlainPhoneNumber = (formattedNumber) => {
        return formattedNumber.replace(/\D/g, ''); // Remove all non-digits
    };

    const handleConfirm = async (event) => {
        event.preventDefault();
        console.log("Settings confirmed going back to logs!");

        const userEmail = localStorage.getItem("userEmail");
        console.log(localStorage.getItem("userEmail"));

        if (!userEmail) {
            throw new Error("User email not found.");
        }

        const userIdResponse = await axios.get(`http://localhost:3000/user/userIdFromEmail?email=${userEmail}`);
        const userId = userIdResponse.data.id;

        if (phoneNumber && profile?.id) {
            const plainPhoneNumber = toPlainPhoneNumber(phoneNumber);
            try {
                const response = await fetch(`http://localhost:3000/user/${userId}/phone`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phoneNumber: plainPhoneNumber }),
                });

                const data = await response.json();
                if (response.ok) {
                    console.log('Phone number updated:', data);
                    alert('Phone number updated successfully!');
                } else {
                    throw new Error(data.message || "Failed to update phone number");
                }
            } catch (error) {
                console.error('Error updating phone number:', error);
                alert(error.message);
            }
        } else {
            alert('User ID or phone number missing!');
        }
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
                            placeholder="1234567890"
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
