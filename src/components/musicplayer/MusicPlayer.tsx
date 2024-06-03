import { useState, useRef } from "react";

import starter_song from "../../../example/FFXIII Sabers Edge.mp3";
import Slider from "./Slider/Slider";
import ControlPanel from "./Controls/ControlPanel";
import { AudioPlayerProps } from "../../interfaces/Interfaces";

export default function MusicPlayer({
  curTime,
  setCurTime,
  setAudioRecentlyToggled,
  isPlaying,
  setIsPlaying,
}: AudioPlayerProps) {
  const [percentage, setPercentage] = useState<number>(0);
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
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 1;

      if (!isPlaying) {
        console.log("isPlaying set true");
        audio.play();
        setIsPlaying(true);
        setAudioRecentlyToggled(true, true);
        console.log(
          "main setAudioRecentlyToggled called, isPlaying:",
          isPlaying
        );
      } else {
        console.log("isPlaying set false");
        audio.pause();
        setIsPlaying(false);
        setAudioRecentlyToggled(true, false);
        console.log(
          "main setAudioRecentlyToggled called, isPlaying:",
          isPlaying
        );
      }
    }
  };

  const getCurDuration = (e: React.ChangeEvent<HTMLAudioElement>) => {
    const percent = (
      (e.currentTarget.currentTime / e.currentTarget.duration) *
      100
    ).toFixed(2);
    const time = e.currentTarget.currentTime;

    // if time moved before curTime or big adjustment made, perform full search
    if (time < curTime || Math.abs(time - curTime) > 1) {
      console.log(
        "sideeffect setAudioRecentlyToggled called, isPlaying:",
        isPlaying
      );
      setAudioRecentlyToggled(true, isPlaying);
    }

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
