import {HeroUIProvider} from "@heroui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

console.log("Ancho de pantalla:", window.innerWidth, "px");
console.log("Alto de pantalla:", window.innerHeight, "px");

ReactDOM.createRoot(document.getElementById("root")).render(
  <HeroUIProvider>
    <App />
  </HeroUIProvider>
);
