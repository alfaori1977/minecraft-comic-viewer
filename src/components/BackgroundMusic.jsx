// BackgroundMusic.jsx
import { forwardRef, useImperativeHandle, useRef } from "react";

const BackgroundMusic = forwardRef((props, ref) => {
  const audioRef = useRef(null);
  const { music_file } = props;

  useImperativeHandle(ref, () => ({
    play: () => audioRef.current?.play(),
    pause: () => audioRef.current?.pause(),
    isPlaying: () => !audioRef.current?.paused,
  }));

  return (
    <audio
      key={music_file}
      ref={audioRef}
      src={`/audio/${music_file}.mp3`}
      preload="auto"
      loop
    />
  );
});

export default BackgroundMusic;
