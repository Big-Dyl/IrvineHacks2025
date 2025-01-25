import { Button } from "@/components/ui/button";

import { useState, useEffect } from 'react'
import '../App.css'

import socket from '../socket'

export default function GamePage(){

    const [gameData, setGameData] = useState({
        gameCode: "Loading...",
        cityName: "City Data Loading",
        allStreets: {
            streets: ['...Loading'],
            coords: [[0,0]]
        },
        currentNameIndex: 0,
        currentSecondsLeft: 1,
        currentNamePortions: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    });

    // Get the room code
    const params = new URLSearchParams(document.location.search);
    const roomCode = params.get("roomCode");
    const selectedChar = params.get("selectedChar");

    useEffect(() => {
        // Let the server know that we have joined
        socket.emit("joinGame", { gameCode: roomCode, selectedChar: selectedChar });
    }, []);

    useEffect(() => {
        socket.on("updateGame", (updatedData) => {
            // Update the info
            console.log(JSON.stringify(updatedData));
            setGameData(updatedData);
        });
    }, []);

    const getStreetName = () => {
        // Generate the street name
        // TODO: if we have a special character, affect this?
        let res = ""
        for (let i = 0; i < gameData.allStreets.streets[gameData.currentNameIndex].length; i++) {
            if (gameData.currentNamePortions.includes(i)) {
                res += gameData.allStreets.streets[gameData.currentNameIndex][i];
            } else {
                // Hidden
                res += "_"
            }
        }
        return res;
    };

    return (
        <div>
            Anyone can enter this Room Code to join: <b>{gameData.gameCode}</b>
            <br />
            <div className="text-3xl">
                Guess this street name in <b>{gameData.cityName}</b>
                <br />
                Seconds left: <span>{gameData.currentSecondsLeft}</span>
            </div>
            <br />
            <br />
            <div className="text-5xl">
                <span style={{"letterSpacing": "0.2rem"}}>{getStreetName()}</span>
            </div>
        </div>
    );
}
