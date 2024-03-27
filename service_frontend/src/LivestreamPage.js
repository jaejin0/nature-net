import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LivestreamPage.css';
import SettingsIcon from './settings.png';
import LivestreamIcon from './livestream.png';
import HomeIcon from './home.png';
import Logo from './logo.png'


function LivestreamPage() {
    const navigate = useNavigate();

    const handleSettings = () => {
        console.log("Going to settings page!");
        navigate('/settings');
    };

    const handleHome = () => {
        console.log("Going to logs page!");
        navigate('/logs');
    }

    return (
        <div className="title-settings">
            <img src={Logo} alt="Logo" className='logo'></img>
            <div className="title-space"></div> {/* Left spacer */}
            <div className="title-container"><h2 className="log-title">Remote Livestream</h2></div> {/* Title */}
            <div className="icons-container">
                <img src={SettingsIcon} alt="Settings" className="nav-icon" onClick={handleSettings} />
                <img src={LivestreamIcon} alt="Livestream" className="nav-icon" />
                <img src={HomeIcon} alt="Home" className='nav-icon' onClick={handleHome} />
            </div>
        </div>
    );
}

export default LivestreamPage;