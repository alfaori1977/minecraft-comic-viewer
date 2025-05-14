import { useState, useEffect, useRef } from "react";
import "../css/ComicViewer.css";
import BackgroundMusic from "./BackgroundMusic";

const IMAGE_BASE = "/images"; // Public folder
const DATA_BASE = "/data"; // Public folder

const ComicViewer = () => {
  const [collections, setCollections] = useState({});
  const [collectionNames, setCollectionNames] = useState([]);
  const [captions, setCaptions] = useState({});
  const [currentCollection, setCurrentCollection] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);
  const musicRef = useRef(null);
  const [musicOn, setMusicOn] = useState(false);

  const toggleMusic = () => {
    if (!musicRef.current) return;
    if (musicRef.current.isPlaying()) {
      musicRef.current.pause();
      setMusicOn(false);
    } else {
      musicRef.current.play().then(() => setMusicOn(true));
    }
  };

  const playMusic = () => {
    if (musicRef.current.isPlaying()) return;
    musicRef.current.play().then(() => setMusicOn(true));
  };
  const pauseMusic = () => {
    if (!musicRef.current.isPlaying()) return;
    musicRef.current.pause();
    setMusicOn(false);
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    const res = await fetch(`${DATA_BASE}/collections.json`);
    const config = await res.json();

    const loadedCollections = {};

    for (const [_id, { pages, captions, name, music }] of Object.entries(
      config
    )) {
      loadedCollections[_id] = {};
      loadedCollections[_id]["name"] = name;
      loadedCollections[_id]["images"] = Array.from(
        { length: pages },
        (_, i) => `${IMAGE_BASE}/${_id}/${i.toString().padStart(2, "0")}.jpg`
      );
      loadedCollections[_id]["captions"] = captions;
      loadedCollections[_id]["music"] = music;
    }

    setCollections(loadedCollections);

    const names = Object.keys(config);
    setCollectionNames(names);

    setCurrentCollection(names[0]);
    setPageIndex(0);
  };

  useEffect(() => {
    if (!autoPlay) {
      pauseMusic();
      return;
    }

    playMusic();
    const interval = setInterval(() => {
      const pages = collections[currentCollection]["images"] || [];
      setPageIndex((prev) => (prev + 1) % pages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [autoPlay, currentCollection, collections]);

  if (!currentCollection || !collections[currentCollection])
    return <div>Loading...</div>;

  const images = collections[currentCollection]["images"];
  const currentImage = images[pageIndex];
  const currentCaption =
    collections[currentCollection]["captions"]?.[pageIndex] || "";
  const collectionName =
    collections[currentCollection]["name"] || currentCollection;
  const musicFile = collections[currentCollection]["music"] || "";

  return (
    <>
      <BackgroundMusic ref={musicRef} music_file={musicFile} />
      <div className="comic-wrapper">
        <h1 className="comic-title">La Aventura Minecraft. {collectionName}</h1>

        <div className="mt-4">
          <select
            className="comic-select"
            value={currentCollection}
            onChange={(e) => {
              setCurrentCollection(e.target.value);
              setPageIndex(0);
            }}
          >
            {collectionNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <img
          src={currentImage}
          alt={`Page ${pageIndex}`}
          className="comic-image"
        />

        <div className="comic-caption">{currentCaption}</div>

        <div className="comic-controls">
          <button
            className="comic-button"
            onClick={() => setPageIndex(Math.max(pageIndex - 1, 0))}
          >
            Anterior
          </button>
          <button
            className={`play-button ${autoPlay ? "playing" : ""}`}
            onClick={() => setAutoPlay(!autoPlay)}
          >
            {autoPlay ? "Pausar" : "Reproducir"}
          </button>
          <button
            className="comic-button"
            onClick={() =>
              setPageIndex(Math.min(pageIndex + 1, images.length - 1))
            }
          >
            Siguiente
          </button>

          <div className="comic-controls">
            {/* your other buttons */}
            <button className="comic-button2" onClick={toggleMusic}>
              {musicOn ? "🔇" : "🔊"}
            </button>
          </div>
        </div>

        <div className="comic-footer">
          <p className="page-indicator">
            Página {pageIndex + 1} de {images.length}
          </p>
          <p className="author-credit">Una Idea de Erik Salcedo Pozas</p>
        </div>
      </div>
    </>
  );
};

export default ComicViewer;
