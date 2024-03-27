import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SettingsPage.css';
import SettingsIcon from './settings.png'; // Ensure this path is correct
import LivestreamIcon from './livestream.png';
import HomeIcon from './home.png';
import Logo from './logo.png'


function Settings() {

    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [threatLevel, setThreatLevel] = useState('');
    const navigate = useNavigate();


    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(password);
    };

    const handleConfirm = () => {
        console.log("Settings confirmed going back to logs!")
        navigate('/logs')
    }
    const handleHome = () => {
        console.log("Going to logs page!");
        navigate('/logs');
    }
    const handleLivestream = () => {
        console.log("Going to livestream page!");
        navigate('/livestream');
    }

    return (
        <div className="title-settings">
            <img src={Logo} alt="Logo" className='logo'></img>
            <div className="title-space"></div> {/* Left spacer */}
            <div className="title-container"><h2 className="log-title">NatureNet</h2></div> {/* Title */}
            <div className="icons-container">
                <img src={SettingsIcon} alt="Settings" className="nav-icon" />
                <img src={LivestreamIcon} alt="Livestream" className="nav-icon" onClick={handleLivestream} />
                <img src={HomeIcon} alt="Home" className='nav-icon' onClick={handleHome} />
            </div>

            <div className="settings-container">
                <h2 className="settings-title">Settings</h2>
                <form onSubmit={handleSubmit} className="settings-form">
                    <div className="input-group">
                        <label htmlFor="password" className="input-label">Change Password</label>
                        <input type="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="phoneNumber" className="input-label">Change Phone Number</label>
                        <input type="phoneNumber" id="phoneNumber" placeholder="(123)456-7890" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="input-field" />
                    </div>
                    <div className="input-group">
                        <label htmlFor="threatLevel" className="input-label">Threat Level Configuration</label>
                        <input type="threatLevel" id="threatLevel" placeholder="" value={threatLevel} onChange={(e) => setThreatLevel(e.target.value)} className="input-field" />
                    </div>
                    <button type="button" onClick={handleConfirm} className="confirm-button">Confirm</button>
                    <button type="button" className="AccountDelete-button">DELETE ACCOUNT</button>
                </form>
            </div>
        </div>
    )
}

export default Settings;