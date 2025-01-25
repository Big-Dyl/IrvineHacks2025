import { Button } from "@/components/ui/button";

import { useState, useEffect } from 'react'
import '../App.css'

import socket from '../socket'

export default function GamePage(){

    const [gameData, setGameData] = useState({
        cityName: "City Data Loading",
        allNames: ["Loading..."],
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

    return (
        <div>
            <div className="text-5xl">
                {gameData.cityName}
                <br />
                Seconds left: <span>{gameData.currentSecondsLeft}</span>
            </div>
            <Button>sad</Button>
        </div>
    );
}
