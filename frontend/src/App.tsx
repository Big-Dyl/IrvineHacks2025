import { useEffect, useState } from 'react'
import './App.css'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { ComboboxDemo } from './game/citybox'
import { Button } from "@/components/ui/button"

import Pioneer from "./assets/PeterAnteater-new_canvas.png"
import Rouge from "./assets/Rouge.png"
import Peter from "./assets/Peter_AntEater.png"


function App() {
  const [selectedChar, setSelectedChar] = useState(0);
  const [roomCode, setRoomCode] = useState("");

  const hostGame = () => {
    // Create the game, and go to the corresponding URL
    // TODO: create the actual thing
    const newUrl = new URL(document.location + "./game");
    newUrl.searchParams.append("selectedChar", ("" + selectedChar));
    newUrl.searchParams.append("roomCode", roomCode);
    window.location.href = newUrl.toString();
  };

  const joinGame = () => {
    // Join the game, and go to the corresponding URL
    // TODO: does it exist?
    const newUrl = new URL(document.location + "./game");
    newUrl.searchParams.append("selectedChar", ("" + selectedChar));
    newUrl.searchParams.append("roomCode", roomCode);
    window.location.href = newUrl.toString();
  };

  // select character
  const [choice, setChoice] = useState(0);

  return (
    <>
      <div className='mx-auto w-4/5 h-screen border-4 border-blue border-dashed'>
        <h1 className='font-bold text-white text-6xl flex justify-center mt-24 border-t-20 py-4 border-b-20'>- - - - - - - - -  🧐 SpeedStreets 🏙  - - - - - - - - -</h1>
        <div id='inputs' className='flex items-end justify-center mx-auto my-18 w-1/2 h-200px'>
          
          <Input
            className='border-4 h-12 bg-white'
            type='text'
            placeholder='Enter your name'
            style={{width: 180}}
          />
          <div className='ml-20'>
            <Label htmlFor='roomcode' className='text-white'>Enter a room code to join:</Label>
            <Input
              id='roomcode'
              placeholder='Roomcode'
              className='border-4 h-12 bg-white'
              style={{width: 180}}
            />
          </div>
          <Button className='bg-black text-white h-12 ml-2'>Hop on!</Button>

          <div className='ml-20'>
            <Label htmlFor='' className='text-white shadow-lg'>Or select a city to host:</Label>
            <ComboboxDemo/>
          </div>
          <Button className='bg-black text-white h-12 ml-2'>Host it!</Button>

        </div>
        <div className='font-sans text-white text-2xl flex justify-center mt-18'>Select your characters:</div>
        <div className='flex mx-auto w-4/5 mt-10 justify-center'>
          <img src={Peter} className={`w-80 h-80 object-contain p-4 ${choice==0? 'rounded-full outline-1' : ''}`} onClick={()=>{setChoice(0)}}/>
          <img src={Pioneer} className={`w-80 h-80 object-contain p-4 ${choice==1? 'rounded-full outline-1' : ''}` } onClick={()=>{setChoice(1)}}/>
          <img src={Rouge} className={`w-80 h-80 object-contain p-4 ${choice==2? 'rounded-full outline-1' : ''}` } onClick={()=>{setChoice(2)}}/>
        </div>
      </div>
    </>
  );
}

export default App
