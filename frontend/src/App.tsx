import { useEffect, useState } from 'react'
import './App.css'

import socket from './socket'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { ComboboxDemo } from './game/citybox'
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"


import Pioneer from "./assets/PeterAnteater-new_canvas.png"
import Rouge from "./assets/Rouge.png"
import Peter from "./assets/Peter_AntEater.png"
import Brush from "./assets/green.png"

function App() {
  const [selectedChar, setSelectedChar] = useState(0);
  const [roomCode, setRoomCode] = useState("");
  const [cityName, setCityName] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [loading, setLoading] = useState(false);

  function constructURL(gameCode : string){
    const newUrl = new URL(document.location + "./game");
  }
  /*useEffect(() => {
  */
  socket.on("gameCreated", (gameCode) => {
    // Go to the corresponding URL
    const newUrl = new URL(document.location + "./game");
    newUrl.searchParams.append("selectedChar", ("" + selectedChar));
    newUrl.searchParams.append("roomCode", gameCode);
    newUrl.searchParams.append("playerName", playerName);
    window.location.href = newUrl.toString();
  });
  /*}, []);*/

  const hostGame = () => {
    // Create the game; wait for the message back to navigate
    // TODO: create the actual thing
    socket.emit("createGame", cityName);
    setLoading(true);
  };

  const joinGame = () => {
    // Join the game, and go to the corresponding URL
    // TODO: does it exist?
    const newUrl = new URL(document.location + "./game");
    newUrl.searchParams.append("selectedChar", ("" + selectedChar));
    newUrl.searchParams.append("roomCode", roomCode);
    newUrl.searchParams.append("playerName", playerName);
    window.location.href = newUrl.toString();
    setLoading(true);
  };

  // select character
  const [choice, setChoice] = useState(0);

  return (
    <>
      <div className='mx-auto w-4/5 h-screen mt-16'>
        <h1 className='font-bold text-white text-6xl flex justify-center border-t-20 py-4 border-b-20'>- - - - - - - - -  🧐 SpeedStreets 🏙  - - - - - - - - -</h1>
        {loading
          ?
            <div>
              <br />
              <br />
              <h2 className='font-bold text-white text-6x1 flex justify-center'>
                Loading your city...
                <br />
                <br />
                This may take a few seconds
              </h2>
            </div>
        :
        <div>
          <div id='inputs' className='flex items-end justify-center mx-auto my-18 w-1/2 h-200px'>
            <Input
              className='border-4 h-12 bg-white'
              type='text'
              placeholder='Enter your name'
              style={{width: 180}}
              onChange={e => setPlayerName(e.target.value)}
            />
            <div className='ml-20'>
              <Label htmlFor='roomcode' className='text-white'>Enter a room code to join:</Label>
              <Input
                id='roomcode'
                placeholder='Roomcode'
                className='border-4 h-12 bg-white'
                style={{width: 180}}
                onChange={e => setRoomCode(e.target.value)}
              />
            </div>
            <Button className='bg-black text-white h-12 ml-2' onClick={joinGame}>Hop on!</Button>

            <div className='ml-20'>
              <Label htmlFor='' className='text-white shadow-lg'>Or select a city to host:</Label>
              <ComboboxDemo setCity={setCityName}/>
            </div>
            <Button className='bg-black text-white h-12 ml-2' onClick={hostGame}>Host it!</Button>
          </div>

          <div className='flex justify-center'>
            <div className='relative'>

              <img src={Brush} className='w-100 h-12'/>
              <div className='absolute inset-0 font-sans text-white text-2xl flex justify-center'>Select your characters:</div>
            </div>
          </div>
          <div className='flex mx-auto w-4/5 mt-4 justify-center'>
            <HoverCard>
              <HoverCardTrigger>
                <img src={Peter} className={`w-80 h-80 object-contain p-4 ${choice==0? 'rounded-full outline-1' : ''}`} onClick={()=>{setChoice(0); setSelectedChar(0);}}/>
                <div className='flex justify-center font-serif text-2xl'>Peter</div>
              </HoverCardTrigger>
              <HoverCardContent className='bg-white'>
                <div className='text-2xl font-serif'>Peter, a humble anteater explorer.</div>
                <div>which means you have no special abilities :P</div>
              </HoverCardContent>
            </HoverCard>

            <HoverCard>
              <HoverCardTrigger>
                <img src={Pioneer} className={`w-80 h-80 object-contain p-4 ${choice==1? 'rounded-full outline-1' : ''}` } onClick={()=>{setChoice(1);setSelectedChar(1);}}/>
                <div className='flex justify-center font-serif text-2xl'>Pioneer</div>
              </HoverCardTrigger>
              <HoverCardContent className='bg-white'>
                <div className='text-2xl font-serif'>Pioneer, a geography expert.</div>
                <div>Get more hints but also fewer scores on correct answer.</div>
              </HoverCardContent>
            </HoverCard>

            <HoverCard>
              <HoverCardTrigger>
                <img src={Rouge} className={`w-80 h-80 object-contain p-4 ${choice==2? 'rounded-full outline-1' : ''}` } onClick={()=>{setChoice(2); setSelectedChar(2);}}/>
                <div className='flex justify-center font-serif text-2xl'>Rouge</div>
              </HoverCardTrigger>
              <HoverCardContent className='bg-white'>
                <div className='text-2xl font-serif'>Rouge, the impatient.</div>
                <div>Get <span className='font-bold'>1.5x scores</span> if answering in first <span className='font-bold'>10 seconds</span>, but get <span className='font-bold'>0.5 scores</span> if answering in last <span className='font-bold'>5 seconds</span>.</div>
              </HoverCardContent>
            </HoverCard>
          </div>

        </div>}
      </div>
    </>
  );
}

export default App
