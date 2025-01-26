import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App";
import GamePage from "./game/game.tsx";
import {TextArea} from "./game/textchannel.tsx";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="game" element={<GamePage />} />
      <Route path="texta" element={<TextArea/>}/>
    </Routes>
  </BrowserRouter>
);
