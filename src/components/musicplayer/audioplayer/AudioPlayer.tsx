import { useState, useRef } from "react";

import starter_song from "../../../../example/FFXIII Sabers Edge.mp3";
import Slider from "./Slider/Slider";
import ControlPanel from "./Controls/ControlPanel";

import "./AudioPlayer.css";

interface AudioPlayerProps {
  curTime: number;
  setCurTime: React.Dispatch<React.SetStateAction<number>>;
  syncCounter: (isPlaying: boolean) => void;
  stopCounter: () => void;
}

export default function AudioPlayer({
  curTime,
  setCurTime,
  syncCounter,
  stopCounter,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
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
        setIsPlaying(true);
        syncCounter(true);
        console.debug("music playing");
      } else {
        audio.pause();
        setIsPlaying(false);
        syncCounter(false);
        console.debug("music paused");
      }
    }
  };

  const updateTime = (e: React.ChangeEvent<HTMLAudioElement>) => {
    const percent = +(
      (e.currentTarget.currentTime / e.currentTarget.duration) *
      100
    ).toFixed(2);
    const time = e.currentTarget.currentTime;

    // if curTime gets moved backwards or big adjustment made, full search to get back on track
    if (time < curTime || Math.abs(time - curTime) > 1) {
      console.debug("big time adjustment, isPlaying is", isPlaying);
      syncCounter(isPlaying);
    }

    setPercentage(percent);
    setCurTime(parseFloat(time.toFixed(2)));

    if (percent >= 100) {
      setIsPlaying(false);
      stopCounter();
    }
  };

  return (
    <div className="audio-player">
      <h3>{"Audio Only"}</h3>
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
