import React, { useEffect } from 'react';

const GoogleOAuth = ({ onSignIn }) => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://apis.google.com/js/platform.js";
        script.onload = () => {
            window.gapi.load('auth2', () => {
                window.gapi.auth2.init({
                    client_id: "205390393298-k2dgqitl5l2rid2q3knnkm0daob8gnns.apps.googleusercontent.com"
                });
            });
        };
        document.body.appendChild(script);



        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        }

    }, []);

    const handleSignIn = () => {
        const auth2 = window.gapi.auth2.getAuthInstance();
        auth2.signIn().then(googleUser => {
            const profile = googleUser.getBasicProfile();
            console.log('ID:', profile.getId());
            console.log('Name:', profile.getName());
            console.log('Image URL:', profile.getImageUrl());
            console.log('Email:', profile.getEmail());

            if (onSignIn) {
                onSignIn(profile);
            }
        });
    };



    return (
        <button onClick={handleSignIn}>Sign in with Google</button>
    );
};

export default GoogleOAuth;
