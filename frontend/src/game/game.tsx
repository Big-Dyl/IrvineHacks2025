import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"  
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"


import Blue from "@/assets/bluebrush.png"

import { useState, useEffect, useRef } from 'react'
import '../App.css'
// @ts-ignore Import module
import * as L from 'https://unpkg.com/leaflet@1.8.0/dist/leaflet-src.esm.js'
//import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'

import { RankBar } from "./sidebar";
//import { fakeList } from "@/main";

import socket from '../socket'
import { EndScreen } from "./endscreen";

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
}) {
    return (
        
        <div className="map ml-10 border-2 border-dashed rounded-xl bg-white p-2">
            <MapContainer
                center={[props.center_second, props.center_first]} zoom={props.zoom} scrollWheelZoom={false}
                style={{width:"80vh" ,"height": "60vh"}}
                className="aspect-w-4 aspect-h-3"
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
        chat: [],
        currentSecondsLeft: 1,
        totalSeconds: 1,
        currentNamePortions: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        playersSuccessful: []
    });

    const [allUsers, setAllUsers] = useState([{
        id: "0001",
        rk: 1,
        name: "Loading...",
        char: 1,
        score: 1
    }]);

    //let mapRef = useRef(null);

    // Get the room code
    const params = new URLSearchParams(document.location.search);
    const roomCode = params.get("roomCode");
    const selectedChar = params.get("selectedChar");
    const playerName = params.get("playerName");

    const submitChatInput = (chatInput: string) => {
        console.log("Guessing: " + chatInput);
        socket.emit("guessName", chatInput);
    }

    useEffect(() => {
        // Let the server know that we have joined
        socket.emit("joinGame", { gameCode: roomCode, selectedChar: selectedChar, playerName: playerName });
    }, []);

    useEffect(() => {
        socket.on("updateGame", (updatedData) => {
            // Update the info
            setGameData(updatedData);
        });

        socket.on("returnPlayers", (updatedPlayers) => {
            // Update the info
            //console.log("Updated players with: " + JSON.stringify(updatedPlayers));
            setAllUsers(updatedPlayers);
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

    // another getStreetName; for better looking
    const getStreetName_new = () => {
        let res = [];
        for (let i=0; i<gameData.allStreets.streets[gameData.currentNameIndex].length; i++){
            let ch = "_";
            if (gameData.currentNamePortions.includes(i) || gameData.allStreets.streets[gameData.currentNameIndex][i] == " ") {
                ch = gameData.allStreets.streets[gameData.currentNameIndex][i];
            }
            res.push(
                <div className="rounded-xl w-12 h-12 bg-white flex justify-center items-center border-2 border-dashed shadow-lg m-2 p-2 text-2xl font-bold font-serif">{ch}</div>
            );
        }
        return res;
    }

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
                    <RankBar className="h-screen w-70 mt-4" playerList={allUsers}/>
                </div>
                <div className="flex-col justify-center">
                    <div className="mt-6 ml-40 h-16 items-center text-2xl font-serif">Guess a street's name in  <b className="text-5xl text-red-600 underline ml-4">{gameData.cityName}</b></div>
                    {(gameData.currentNameIndex >= 2 || gameData.currentNameIndex == gameData.allStreets.streets.length) ? <EndScreen></EndScreen> : <MyMap center_first={gameData.allStreets.coords[gameData.currentNameIndex][1]} center_second={gameData.allStreets.coords[gameData.currentNameIndex][0]} zoom={getZoomAmount()}/>}
                    <ProgressBar value={gameData.totalSeconds-gameData.currentSecondsLeft} tot={gameData.totalSeconds}></ProgressBar>
                    <div className="text-5xl mt-4 ml-6">
                        <div className="flex flex-wrap" style={{"letterSpacing": "0.2rem", width: "80vh"}}>{getStreetName_new()}</div>
                    </div>
                </div>
                <div className="ml-4 mt-24 flex flex-col">
                    <TextBar submitInput={submitChatInput} chat={gameData.chat}></TextBar>
                </div>
            </div>
        </div>
    );
}

interface Chat{
    sender: string; // sender's username

}

//interface 

const TextBar = (props: any) => {
    const [theChatInput, setTheChatInput] = useState("");

    const handleChange = (e: any) => {
        setTheChatInput(e.target.value);
    }

    const submitTheInput = (e: any) => {
        if(e.key == "Enter") {
            props.submitInput(theChatInput);
            setTheChatInput("");
        }
    }
    return (
        <div>
        <Card className="bg-white" style={{width: "10rem", height: "60vh", overflow: "auto"}}>
                <ul>
                    {props.chat.map((item: any, i: number) => {
                        return <li key={i}>{item}</li>;
                    })}
                </ul>
            </Card>
            <Input value={theChatInput} className="bg-white mt-4 border-2" placeholder="Type your answer" onChange={handleChange} onKeyDown={submitTheInput} />
        </div>
    );
}
// progress bar
interface ProgressProps{
    value: number;
    tot: number;
}
const ProgressBar: React.FC<ProgressProps> = ({value, tot}) => {
    return (
        <div className="relative border-2 rounded-xl h-10 mt-4 ml-4">
            <div className="absolute inset-0 bg-blue-500 rounded-l-lg" style={{width: `${Math.floor(100*value/tot)}%`}}></div>
            <div className="absolute inset-0 bg-white rounded-r-lg" style={{left: `${Math.floor(100*value/tot)}%`, width: `${100-Math.floor(100*value/tot)}%`}}></div>
        </div>
    );
}
