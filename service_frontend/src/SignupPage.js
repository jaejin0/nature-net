import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignupPage.css';
import lockIcon from './lock.png'

function SignUpPage() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(username, password, phoneNumber, email);
    };

    const handleSignUp = () => {
        console.log("Getting in here!")
        navigate('/');
    };

    return (
        <div className="signup-container">
            <h2 className="signup-title">Sign Up</h2>
            <form onSubmit={handleSubmit} className="signup-form">
                <div className="input-group">
                    <label htmlFor="username" className="input-label">Name</label>
                    <input type="text" id="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="input-field" />
                </div>
                <div className="input-group">
                    <label htmlFor="password" className="input-label">Password</label>
                    <input type="password" id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" />
                </div>
                <div className="input-group">
                    <label htmlFor="phoneNumber" className="input-label">Phone Number</label>
                    <input type="text" id="phoneNumber" placeholder="(xxx)xxx-xxxx" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="input-field" />
                </div>
                <div className="input-group">
                    <label htmlFor="email" className="input-label">Email</label>
                    <input type="text" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" />
                </div>
                <button type="button" onClick={handleSignUp} className="login-button">
                    <img src={lockIcon} alt="Lock" className="icon-lock" />
                    Sign Up
                </button>
            </form>
        </div>
    );
}

export default SignUpPage;