import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import GoogleOAuth from './GoogleOAuth'; // Adjust the path as needed
import lockIcon from './lock.png'
import { GoogleLogin } from '@react-oauth/google';


function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(username, password);
    };

    const handleSignUp = () => {
        console.log("Going to sign up page!")
        navigate('/signup');
    };

    const handleLogin = () => {
        console.log("Going to login page!")
        navigate('./logs');
    }

    const responseMessage = (response) => {
        console.log(response);
    };
    const errorMessage = (error) => {
        console.log(error);
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Login</h2>
            <form onSubmit={handleSubmit} className="login-form">

                <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />



                <div className="input-group">
                    <label htmlFor="username" className="input-label">Name</label>
                    <input type="text" id="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="input-field" />
                </div>
                <div className="input-group">
                    <label htmlFor="password" className="input-label">Password</label>
                    <input type="password" id="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" />
                </div>
                <button type="submit" onClick={handleLogin} className="login-button">
                    <img src={lockIcon} alt="Lock" className="icon-lock" />
                    Log in
                </button>
                <button type="button" onClick={handleSignUp} className="signup-button">Sign-Up</button>
            </form>
        </div>
    );
}

export default LoginPage;
