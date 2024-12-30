import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// biome-ignore lint: Included in the blank default app.
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
