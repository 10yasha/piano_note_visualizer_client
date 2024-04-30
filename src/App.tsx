import { useState, useRef } from "react";
import starter_song from "./../example/FFXIII Sabers Edge.mp3";
import Slider from "./components/slider/Slider";
import ControlPanel from "./components/controls/ControlPanel";
import MidiParser from "midi-parser-js";

function App() {
  const [percentage, setPercentage] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = (audio.duration / 100) * e.target.valueAsNumber;
      setPercentage(e.target.valueAsNumber);
    }
  };

  const play = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.1;

      if (!isPlaying) {
        setIsPlaying(true);
        audio.play();
      } else {
        setIsPlaying(false);
        audio.pause();
      }
    }
  };

  const getCurDuration = (e: React.ChangeEvent<HTMLAudioElement>) => {
    const percent = (
      (e.currentTarget.currentTime / e.currentTarget.duration) *
      100
    ).toFixed(2);
    const time = e.currentTarget.currentTime;

    setPercentage(+percent);
    setCurrentTime(parseFloat(time.toFixed(2)));
  };

  return (
    <div className="app-container">
      <h1>{starter_song}</h1>
      <Slider percentage={percentage} onChange={onChange} />
      <audio
        ref={audioRef}
        onTimeUpdate={getCurDuration}
        onLoadedData={(e) => {
          setDuration(parseFloat(e.currentTarget.duration.toFixed(2)));
        }}
        src={starter_song}
      ></audio>
      <ControlPanel
        play={play}
        isPlaying={isPlaying}
        duration={duration}
        currentTime={currentTime}
      />
    </div>
  );
}

export default App;
