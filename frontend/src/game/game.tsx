import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  

import { useState, useEffect, useRef } from 'react'
import '../App.css'
// @ts-ignore Import module
import * as L from 'https://unpkg.com/leaflet@1.8.0/dist/leaflet-src.esm.js'
//import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'

import { RankBar } from "./sidebar";
import { fakeList } from "@/main";

import socket from '../socket'

function ChangeView(props: {
    center_first: number,
    center_second: number,
    zoom: number
}) {
    const map = useMap();
    map.setView([props.center_first, props.center_second], props.zoom);

    return null;
}

function MyMap(props: {
    center_first: number,
    center_second: number,
    zoom: number,
    className: string,
}) {
    return (
        <div className={`map ${props.className}`}>
            <MapContainer
                center={[props.center_second, props.center_first]} zoom={props.zoom} scrollWheelZoom={false}
                style={{"height": "90vh"}}
            >
                <ChangeView center_first={props.center_first} center_second={props.center_second} zoom={props.zoom} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
        </div>
    );
}

export default function GamePage(){

    const [gameData, setGameData] = useState({
        gameCode: "Loading...",
        cityName: "City Data Loading",
        allStreets: {
            streets: ['...Loading'],
            coords: [[0, 0]]
        },
        currentNameIndex: 0,
        currentSecondsLeft: 1,
        totalSeconds: 1,
        currentNamePortions: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    });

    //let mapRef = useRef(null);

    // Get the room code
    const params = new URLSearchParams(document.location.search);
    const roomCode = params.get("roomCode");
    const selectedChar = params.get("selectedChar");
    const playerName = params.get("playerName");

    useEffect(() => {
        // Let the server know that we have joined
        socket.emit("joinGame", { gameCode: roomCode, selectedChar: selectedChar, playerName: playerName });
    }, []);

    useEffect(() => {
        socket.on("updateGame", (updatedData) => {
            // Update the info
            setGameData(updatedData);
            // TODO: Update the map?
        });
    }, []);

    const updateMapLocation = () => {
        const map = useMap();
        map.setView([gameData.allStreets.coords[gameData.currentNameIndex][1], gameData.allStreets.coords[gameData.currentNameIndex][0]], getZoomAmount());
    }

    const getStreetName = () => {
        // Generate the street name
        // TODO: if we have a special character, affect this?
        let res = "";
        for (let i = 0; i < gameData.allStreets.streets[gameData.currentNameIndex].length; i++) {
            if (gameData.currentNamePortions.includes(i) || gameData.allStreets.streets[gameData.currentNameIndex][i] == " ") {
                res += gameData.allStreets.streets[gameData.currentNameIndex][i];
            } else {
                // Hidden
                res += "_";
            }
        }
        return res;
    };

    // Get the zoom amount
    const getZoomAmount = () => {
        //return Math.min(30, Math.max(14, 10 + (1 - (gameData.currentSecondsLeft / gameData.totalSeconds)) * 20));
        // Zooming out slowly
        const minZoom = 14;
        const maxZoom = 20;
        const percentFinished = 1 - Math.max(0, Math.min(1, gameData.currentSecondsLeft / gameData.totalSeconds));
        const res = minZoom + (maxZoom - minZoom) * percentFinished;
        return res;
    }

    // for button click effect
    let [copied, setCopied] = useState(false);
    function handleClick(){
        navigator.clipboard.writeText(gameData.gameCode);
        setCopied(true);
        setTimeout(()=>{setCopied(false)}, 2000);
    }

    // crossorigin="" was included originally in the leaflet stylesheet and script
    return (
        <div className="w-4/5 mx-auto h-screen">
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" />
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
                integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" />
            
            <div className="flex">
                <div>
                    <div id="titlebar" className="h-24 flex items-center mt-4 ml-5">
                        <Button 
                            className="bg-black text-white w-60 h-16 rounded-xl text-xl cursor-pointer"
                            onClick={handleClick}>
                                {copied? "Copied!": gameData.gameCode} 📋
                        </Button>
                    </div>
                    <RankBar className="h-screen w-70 mt-4" playerList={fakeList}/>
                </div>
                <div>
                    <div className="flex mt-6 ml-40 h-20 w-120 items-center text-2xl font-serif">Guess a street's name in <b className="text-5xl text-red-600 underline ml-4">{gameData.cityName}</b></div>
                    <MyMap center_first={gameData.allStreets.coords[gameData.currentNameIndex][1]} center_second={gameData.allStreets.coords[gameData.currentNameIndex][0]} zoom={getZoomAmount()} />
                </div>
            </div>

            <br />
            <div className="text-5xl">
                <span style={{"letterSpacing": "0.2rem"}}>{getStreetName()}</span>
                <span style={{"float": "right"}}>
                    Seconds left: <span>{gameData.currentSecondsLeft}</span>
                </span>
            </div>
            The map will zoom in on the street:
            {/*<div id="map" style={{"width": "100%", "height": "60vh"}}></div>*/}
        </div>
    );
}
