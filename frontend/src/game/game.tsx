import { Button } from "@/components/ui/button";

import { useState, useEffect, useRef } from 'react'
import '../App.css'
// @ts-ignore Import module
import * as L from 'https://unpkg.com/leaflet@1.8.0/dist/leaflet-src.esm.js'
//import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'

import socket from '../socket'

function ChangeView(props: {
    center_first: number,
    center_second: number,
    zoom: number
}) {
    const map = useMap();
    map.setView([props.center_first, props.center_second], props.zoom);
    console.log(props.center_second, props.center_first);

    return null;
}

function MyMap(props: {
    center_first: number,
    center_second: number,
    zoom: number
}) {
    return (
        <div className="map">
            <MapContainer
                center={[props.center_second, props.center_first]} zoom={props.zoom} scrollWheelZoom={false}
                style={{"height": "90vh"}}
            >
                <ChangeView center_first={props.center_first} center_second={props.center_second} zoom={props.zoom} />
                <TileLayer
                    attribution = '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url = 'https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg'
                />
            </MapContainer>
        </div>
    )
    // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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

    useEffect(() => {
        // Let the server know that we have joined
        socket.emit("joinGame", { gameCode: roomCode, selectedChar: selectedChar });
    }, []);

    useEffect(() => {
        socket.on("updateGame", (updatedData) => {
            // Update the info
            //console.log(JSON.stringify(updatedData));
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

    // Get the zoom amount
    const getZoomAmount = () => {
        //return Math.min(30, Math.max(14, 10 + (1 - (gameData.currentSecondsLeft / gameData.totalSeconds)) * 20));
        // Zooming out slowly
        const minZoom = 14;
        const maxZoom = 20;
        const percentFinished = Math.max(0, Math.min(1, gameData.currentSecondsLeft / gameData.totalSeconds));
        console.log(percentFinished);
        const res = minZoom + (maxZoom - minZoom) * percentFinished;
        console.log(res);
        return res;
    }

    // Map setup
    useEffect(() => {
        return;
        let map = L.map('map').setView([51.505, -0.09], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);
        let Stadia_StamenWatercolor = L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.{ext}', {
            minZoom: 1,
            maxZoom: 16,
            attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            ext: 'jpg'
        });
        Stadia_StamenWatercolor.addTo(map);
        map.dragging.disable();
        map.touchZoom.disable();
        map.doubleClickZoom.disable();
        map.scrollWheelZoom.disable();
        map.boxZoom.disable();
        map.keyboard.disable();
        if (map.tap) map.tap.disable();
        document.getElementById('map')!.style.cursor='default';
        /*//mapRef.current!.mapRefObj = map;
        //setMainMap(map);
        //updateMap();
        setInterval(() => {
            // Keep updating
            console.log(gameData.currentSecondsLeft);
            console.log(gameData.currentSecondsLeft / gameData.totalSeconds);
            let newZoom = Math.min(30, Math.max(14, 10 + (1 - (gameData.currentSecondsLeft / gameData.totalSeconds)) * 20));
            console.log("Map update with new zoom " + newZoom);
            map.setZoom(newZoom);
        }, 1000);
        //document.theMap = map;*/
    }, [/*gameData*/]);

    // crossorigin="" was included originally in the leaflet stylesheet and script
    return (
        <div>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" />
            <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
                integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" />
            Anyone can enter this Room Code to join: <b>{gameData.gameCode}</b>
            <br />
            <div className="text-3xl">
                Guess this street name in <b>{gameData.cityName}</b>
                <br />
            </div>
            <br />
            <br />
            <div className="text-5xl">
                <span style={{"letterSpacing": "0.2rem"}}>{getStreetName()}</span>
                <span style={{"float": "right"}}>
                    Seconds left: <span>{gameData.currentSecondsLeft}</span>
                </span>
            </div>
            The map will zoom in on the street:
            {/*<div id="map" style={{"width": "100%", "height": "60vh"}}></div>*/}
            <MyMap center_first={gameData.allStreets.coords[gameData.currentNameIndex][1]} center_second={gameData.allStreets.coords[gameData.currentNameIndex][0]} zoom={getZoomAmount()} />
        </div>
    );
    // attribution = '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    //url = 'https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.{ext}'


            /*<MapContainer
                style={{"height": "90vh"}}
                className="markercluster-map"
                center={[51.0, 19.0]}
                zoom={4}
                maxZoom={18}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                </MapContainer>*/
}
