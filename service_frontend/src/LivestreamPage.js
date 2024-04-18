import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import './LivestreamPage.css';
import SettingsIcon from './settings.png';
import LivestreamIcon from './livestream.png';
import HomeIcon from './home.png';
import Logo from './logo.png';
import Boar from './boar.png';
import Coyote from './Coyote.png';
import Deer from './deer.png';
import Snake from './snek.png';
import Wolf from './wolf.png';
import Skunk from './skunk.png';
import Cougar from './cougar.png';
import Fox from './fox.png';
import Alligator from './alligator.png';
import Moose from './moose.png';
import Raccoon from './raccoon.png';
import Bear from './bear.png';
import AnimalBox from './AnimalBox';



function LivestreamPage() {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);


    const animals = [
        { name: "boar", image: Boar },
        { name: "coyote", image: Coyote },
        { name: "deer", image: Deer },
        { name: "bear", image: Bear },
        { name: "snake", image: Snake },
        { name: "wolf", image: Wolf },
        { name: "skunk", image: Skunk },
        { name: "cougar", image: Cougar },
        { name: "fox", image: Fox },
        { name: "alligator", image: Alligator },
        { name: "moose", image: Moose },
        { name: "raccoon", image: Raccoon }
    ];

    const [threatLevels, setThreatLevels] = useState({
        boar: "Low",
        coyote: "Low",
        deer: "Low",
        bear: "Low",
        snake: "Low",
        wolf: "Low",
        skunk: "Low",
        cougar: "Low",
        fox: "Low",
        alligator: "Low",
        moose: "Low",
        raccoon: "Low"
    });

    // Find all of the animal id from the user id and animal name

    // Use the animal id and the threat level configurations to set new threat levels

    useEffect(() => {
        const fetchUserId = async () => {
            const userEmail = localStorage.getItem("userEmail");
            if (!userEmail) {
                throw new Error("User email not found.");
            }
            try {
                const response = await axios.get(`http://localhost:3000/user/userIdFromEmail?email=${userEmail}`);
                setUserId(response.data.id);
            } catch (error) {
                console.error("Error fetching user ID:", error);
            }
        };

        fetchUserId();
    }, []);

    const handleSettings = () => {
        console.log("Going to settings page!");
        navigate('/settings');
    };

    const handleHome = () => {
        console.log("Going to logs page!");
        navigate('/logs');
    };

    const setThreatLevel = (animalName, level) => {
        setThreatLevels(prevLevels => ({
            ...prevLevels,
            [animalName]: level
        }));
    };


    const handleConfirm = async () => {
        const animalIds = {};
        const animalDetails = {};  // This will store the merged details of animal IDs and threat levels

        for (let animal of animals) {
            try {
                const response = await axios.post('http://localhost:3000/animal/animalId', {
                    animalName: animal.name,
                    userId: userId
                });
                const idString = response.data;  // Assuming response.data is a string like "animal id:21"
                const idNumber = parseInt(idString.split(':')[1]);  // Split the string and parse the number part

                animalIds[animal.name] = idNumber;  // Store the numeric ID

                // If the animal name exists in threatLevels, merge the ID and threat level
                if (threatLevels.hasOwnProperty(animal.name)) {
                    animalDetails[animal.name] = {
                        id: idNumber,
                        threatLevel: threatLevels[animal.name]
                    };
                }
            } catch (error) {
                console.error(`Error fetching ID for ${animal.name}:`, error);
            }
        }

        // Iterate over animalDetails and update the threat level in the database for each animal
        for (let animalName in animalDetails) {
            const details = animalDetails[animalName];
            try {
                await axios.put(`http://localhost:3000/animal/${details.id}/threatLevel`, {
                    threatLevel: details.threatLevel
                });
            } catch (error) {
                console.error(`Error updating threat level for ${animalName}:`, error);
            }
        }

        console.log(animalIds);  // Logs all fetched animal IDs as numbers
        console.log("Current Threat Levels:", threatLevels);  // Logs existing threat levels
        console.log("Combined Animal Details:", animalDetails);  // Logs the new dictionary with combined details
        console.log(userId);  // Logs the user ID
        navigate('/logs');

    };



    return (
        <div className="title-settings">
            <img src={Logo} alt="Logo" className='logo'></img>
            <div className="title-space"></div>
            <div className="title-container"><h2 className="log-title">Remote Livestream</h2></div>
            <div className="icons-container">
                <img src={SettingsIcon} alt="Settings" className="nav-icon" onClick={handleSettings} />
                <img src={LivestreamIcon} alt="Livestream" className="nav-icon" />
                <img src={HomeIcon} alt="Home" className='nav-icon' onClick={handleHome} />
            </div>

            <div className="config-container">
                {animals.map(animal => (
                    <AnimalBox
                        key={animal.name}
                        image={animal.image}
                        name={animal.name}
                        threatLevel={threatLevels[animal.name]}
                        setThreatLevel={setThreatLevel}
                    />
                ))}
                <button type="submit" className="submit-button" onClick={handleConfirm}>Submit</button>
            </div>
        </div>
    );
}

export default LivestreamPage;