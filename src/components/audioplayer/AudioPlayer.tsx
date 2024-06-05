import { useState, useRef } from "react";

import starter_song from "../../../example/FFXIII Sabers Edge.mp3";
import Slider from "./Slider/Slider";
import ControlPanel from "./Controls/ControlPanel";

import "./AudioPlayer.css";

interface AudioPlayerProps {
  curTime: number;
  setCurTime: React.Dispatch<React.SetStateAction<number>>;
  syncCounter: (isPlaying: boolean) => void;
  isPlaying: boolean;
  updateIsPlaying: (isPlaying: boolean) => void;
}

export default function AudioPlayer({
  curTime,
  setCurTime,
  syncCounter,
  isPlaying,
  updateIsPlaying,
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
        audio.play();
        updateIsPlaying(true);
        syncCounter(true);
        console.log("music playing");
      } else {
        audio.pause();
        updateIsPlaying(false);
        syncCounter(false);
        console.log("music paused");
      }
    }
  };

  const updateTime = (e: React.ChangeEvent<HTMLAudioElement>) => {
    const percent = +(
      (e.currentTarget.currentTime / e.currentTarget.duration) *
      100
    ).toFixed(2);
    const time = e.currentTarget.currentTime;

    // if time moved before curTime or big adjustment made, perform full search
    if (time < curTime || Math.abs(time - curTime) > 1) {
      console.log("side effect syncCounter called, isPlaying:", isPlaying);
      syncCounter(isPlaying);
    }

    setPercentage(percent);
    setCurTime(parseFloat(time.toFixed(2)));

    if (percent >= 100) updateIsPlaying(false);
  };

  return (
    <div className="audio-player">
      <h1>{starter_song}</h1>
      <Slider percentage={percentage} onChange={onChange} />
      <audio
        ref={audioRef}
        onTimeUpdate={updateTime}
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
