import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LogPage.css';
import SettingsIcon from './settings.png'; // Ensure this path is correct
import LivestreamIcon from './livestream.png';
import HomeIcon from './home.png';
import Logo from './logo.png'

function LogPage() {
    const navigate = useNavigate();

    const handleSettings = () => {
        console.log("Going to settings page!");
        navigate('/settings');
    };

    const handleLivestream = () => {
        console.log("Going to livestream page!");
        navigate('/livestream');
    }

    return (
        <div className="header-container">
            <div className="title-settings">
                <img src={Logo} alt="Logo" className='logo'></img>
                <div className="title-space"></div> {/* Left spacer */}
                <div className="title-container"><h2 className="log-title">NatureNet</h2></div> {/* Title */}
                <div className="icons-container">
                    <img src={SettingsIcon} alt="Settings" className="nav-icon" onClick={handleSettings} />
                    <img src={LivestreamIcon} alt="Livestream" className="nav-icon" onClick={handleLivestream} />
                    <img src={HomeIcon} alt="Home" className='nav-icon' />
                </div>
            </div>
            <div className="log">
                <div className="log-items">
                    <div className="input-item">
                        <label htmlFor="name">Name:</label>
                        <input type="text" id="name" />
                    </div>
                    <div className="input-item">
                        <label htmlFor="time">Time:</label>
                        <input type="text" id="time" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LogPage;
