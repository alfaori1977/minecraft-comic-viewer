import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import ComicViewer from "./components/ComicViewer";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ComicViewer />
    </>
  );
}

export default App;
