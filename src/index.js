import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.scss";
import App from "./components/App.jsx";

const root = document.getElementById("root");
createRoot(root).render(<App />);
