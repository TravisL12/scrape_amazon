import React from "react";
import { createRoot } from "react-dom/client";

const root = document.getElementById("root");

const App = () => {
  return <div>It is I, React! Really</div>;
};

createRoot(root).render(<App />);
