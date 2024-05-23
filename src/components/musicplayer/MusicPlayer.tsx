import { useState, useRef } from "react";

import starter_song from "../../../example/FFXIII Sabers Edge.mp3";
import Slider from "./Slider/Slider";
import ControlPanel from "./Controls/ControlPanel";

interface MusicPlayerProps {
  curTime: number;
  setCurTime: React.Dispatch<React.SetStateAction<number>>;
  setAudioRecentlyToggled: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function MusicPlayer({
  curTime,
  setCurTime,
  setAudioRecentlyToggled,
}: MusicPlayerProps) {
  const [percentage, setPercentage] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = (audio.duration / 100) * e.target.valueAsNumber;
      setPercentage(e.target.valueAsNumber);
    }
  };

  const toggleAudioPlayback = () => {
    setAudioRecentlyToggled(true);
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 1;

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
    console.log("raw time ", e.currentTarget.currentTime);
    const percent = (
      (e.currentTarget.currentTime / e.currentTarget.duration) *
      100
    ).toFixed(2);
    const time = e.currentTarget.currentTime;

    // if time moved before curTime or big adjustment made, perform full search
    if (time < curTime || Math.abs(time - curTime) > 1)
      setAudioRecentlyToggled(true);

    setPercentage(+percent);
    setCurTime(parseFloat(time.toFixed(2)));
  };

  return (
    <div className="audio-player">
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
        toggleAudioPlayback={toggleAudioPlayback}
        isPlaying={isPlaying}
        duration={duration}
        currentTime={curTime}
      />
    </div>
  );
}
