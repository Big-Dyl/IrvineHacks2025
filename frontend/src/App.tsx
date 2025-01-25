import { useState } from 'react'
import './App.css'

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

  return (
    <>
      <h1>SpeedStreets</h1>
      <div className="card">
        <div>
        </div>
        <br />
        <div>
          Select your character:
          <div>
            <button style={selectedChar == 0 ? {} : {"backgroundColor": "black"}} onClick={() => setSelectedChar(0)}>Peter</button>
            <button style={selectedChar == 1 ? {} : {"backgroundColor": "black"}}  onClick={() => setSelectedChar(1)}>Pioneer</button>
            <button style={selectedChar == 2 ? {} : {"backgroundColor": "black"}}  onClick={() => setSelectedChar(2)}>Rogue</button>
          </div>
        </div>
        <br />
        <br />
        <div style={{"display": "flex", "alignItems": "center"}}>
          <div>
            <input placeholder="Room Code" value={roomCode} onChange={e => setRoomCode(e.target.value)} />
            <br />
            <button onClick={joinGame}>Join Game!</button>
          </div>
          <div style={{"margin": "20px"}}>
            OR
          </div>
          <div>
            <button onClick={hostGame}>Host Game!</button>
          </div>
        </div>
      </div>
      <p className="read-the-docs">
        Created for IrvineHacks 2025
      </p>
    </>
  );
}

export default App
