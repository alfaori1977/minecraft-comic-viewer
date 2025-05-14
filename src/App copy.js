import React, { useState, useEffect, useCallback } from "react";
// We will create ComicViewer.js next
import ComicViewer from "./components/ComicViewer";

// Define your comic collections here
// For a real app, you might fetch this from a JSON file or an API
const comicCollectionsData = [
  {
    id: "la_aventura_minecraft_1",
    name: "La Aventura Minecraft (I)",
    creator: "Una Idea de Erik Salcedo Pozas",
    // Assuming images are 00.jpg, 01.jpg, ..., 20.jpg
    // For simplicity, we'll store the count and generate filenames.
    // Alternatively, list all filenames if they are not sequential.
    imageCount: 21,
    imagesPrefix: "images/la_aventura_minecraft_1/", // Path relative to public folder
    imageExtension: ".jpg",
    // You can add captions per image here if you want
    // captions: {
    //   "00": "Caption for image 00.jpg",
    //   "01": "Caption for image 01.jpg",
    // }
  },
  {
    id: "another_comic_collection",
    name: "My Other Awesome Comic",
    creator: "Jane Doe",
    imageCount: 5,
    imagesPrefix: "images/another_comic_collection/",
    imageExtension: ".png",
    // captions: { ... }
  },
  // Add more collections as needed
];

function App() {
  // State for the currently selected collection index
  const [selectedCollectionIndex, setSelectedCollectionIndex] = useState(0);
  // State for the current image index within the selected collection
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // State for playback mode
  const [isPlaying, setIsPlaying] = useState(false);
  // State to hold the image filenames for the current collection
  const [currentImages, setCurrentImages] = useState([]);
  // State to hold the captions for the current collection (if any)
  const [currentCaptions, setCurrentCaptions] = useState({});

  // Memoized current collection data to avoid recalculating on every render
  const currentCollection = React.useMemo(() => {
    return comicCollectionsData[selectedCollectionIndex];
  }, [selectedCollectionIndex]);

  // Effect to update images and captions when the collection changes
  useEffect(() => {
    if (currentCollection) {
      const imageFiles = Array.from(
        { length: currentCollection.imageCount },
        (_, i) => {
          const pageNumber = String(i).padStart(2, "0"); // Formats as 00, 01, 02...
          return `${currentCollection.imagesPrefix}${pageNumber}${currentCollection.imageExtension}`;
        }
      );
      setCurrentImages(imageFiles);
      setCurrentCaptions(currentCollection.captions || {});
      setCurrentImageIndex(0); // Reset to first image when collection changes
      setIsPlaying(false); // Stop playback when collection changes
    }
  }, [currentCollection]);

  // --- Navigation Handlers ---
  const handleNextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % currentImages.length);
  }, [currentImages.length]);

  const handlePreviousImage = useCallback(() => {
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + currentImages.length) % currentImages.length
    );
  }, [currentImages.length]);

  // --- Playback Handler ---
  const togglePlayback = useCallback(() => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  }, []);

  // Effect for automatic playback
  useEffect(() => {
    let playbackInterval;
    if (isPlaying && currentImages.length > 0) {
      playbackInterval = setInterval(() => {
        handleNextImage();
      }, 3000); // Change image every 3 seconds
    }
    // Cleanup interval on component unmount or when isPlaying/currentImages changes
    return () => clearInterval(playbackInterval);
  }, [isPlaying, currentImages, handleNextImage]);

  // --- Collection Change Handler ---
  const handleSelectCollection = (event) => {
    setSelectedCollectionIndex(Number(event.target.value));
  };

  // Prepare props for ComicViewer
  const currentImageSrc = currentImages[currentImageIndex] || "";
  const imageNameWithoutPrefixAndExtension = String(currentImageIndex).padStart(
    2,
    "0"
  );
  const currentCaptionText =
    currentCaptions[imageNameWithoutPrefixAndExtension] ||
    `Description for page ${currentImageIndex + 1}...`; // Default caption

  if (!currentCollection) {
    return (
      <div className="text-white p-8 text-center">Loading collections...</div>
    );
  }

  return (
    <div className="min-h-screen bg-comic-brown-dark flex flex-col items-center p-4 font-sans text-comic-text-light">
      {/* App Title */}
      <header className="w-full max-w-4xl mb-6 text-center">
        <h1
          className="text-4xl md:text-5xl font-bold text-comic-gold"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          React Comic Viewer
        </h1>
      </header>

      {/* Collection Selector */}
      {comicCollectionsData.length > 1 && (
        <div className="mb-6 w-full max-w-md">
          <label
            htmlFor="collection-select"
            className="block text-sm font-medium text-comic-text-caption mb-1"
          >
            Select Comic:
          </label>
          <select
            id="collection-select"
            value={selectedCollectionIndex}
            onChange={handleSelectCollection}
            className="block w-full p-3 border border-comic-brown-light rounded-md shadow-sm bg-comic-brown-medium text-comic-text-light focus:ring-comic-gold focus:border-comic-gold"
          >
            {comicCollectionsData.map((collection, index) => (
              <option key={collection.id} value={index}>
                {collection.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Comic Viewer Component */}
      {currentImages.length > 0 ? (
        <ComicViewer
          collectionTitle={currentCollection.name}
          imageSrc={currentImageSrc} // Path relative to public folder
          caption={currentCaptionText}
          currentPage={currentImageIndex + 1}
          totalPages={currentImages.length}
          creator={currentCollection.creator}
          onNext={handleNextImage}
          onPrevious={handlePreviousImage}
          togglePlayback={togglePlayback}
          isPlaying={isPlaying}
        />
      ) : (
        <div className="text-comic-text-caption p-8">
          No images in this collection or collection loading.
        </div>
      )}

      {/* Footer - You can add more details here */}
      <footer className="mt-8 text-center text-sm text-comic-text-caption">
        <p>
          &copy; {new Date().getFullYear()} Comic Viewer App. All Rights
          Reserved (by You!).
        </p>
      </footer>
    </div>
  );
}

export default App;
