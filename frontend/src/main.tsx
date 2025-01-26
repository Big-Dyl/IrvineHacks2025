import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App";
import GamePage from "./game/game.tsx";
import {TextArea} from "./game/textchannel.tsx";
import { RankBar } from "./game/sidebar.tsx";

// for testing
const fakeList = [
  {
    id: "0001",
    name: "codycode",
    char: 1,
    score: 15,
  },
  {
    id: "0002",
    name: "BigDyl",
    char: 2,
    score: 14,
  },
  {
    id: "0003",
    name: "cadec",
    char: 0,
    score: 10,
  },
  {
    id: "0004",
    name: "Randomstreetgay",
    char: 3,
    score: 10,
  }
]

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="game" element={<GamePage />} />
      <Route path="texta" element={<TextArea/>}/>
      <Route path="sideb" element={<RankBar playerList={fakeList} className="w-60 h-screen ml-60 mt-25"/>} />
    </Routes>
  </BrowserRouter>
);
