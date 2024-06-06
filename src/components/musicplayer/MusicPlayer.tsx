import { useState, useRef } from "react";

import AudioPlayer from "./audioplayer/AudioPlayer";
import YoutubePlayer from "./youtubeplayer/YoutubePlayer";
import { Player } from "../../types/GeneralTypes";
import Button from "../button/Button";

import "./MusicPlayer.css";

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
  const [player, setPlayer] = useState<Player>("youtube");
  const intervalRef = useRef<number | null>(null);
  const counterIncrement = 10; // milliseconds, rate at which current notes will update

  const swapPlayer = () => {
    if (player == "youtube") {
      setPlayer("audio");
    } else if (player == "audio") {
      setPlayer("youtube");
    }
  };

  const syncCounter = (isPlaying: boolean) => {
    console.log("counter stopped");
    stopCounter();
    if (isPlaying) {
      console.log("counter restarted");
      startCounter();
    }
    setAudioRecentlyToggled(true);
  };

  /* following counter uses setInterval() to maintain a fast update rate so 
     active notes and waterfall feel responsive */
  const incrementTime = () =>
    setCurTime((curTime) => curTime + counterIncrement / 1000);

  const startCounter = () => {
    intervalRef.current = window.setInterval(incrementTime, counterIncrement);
  };

  const stopCounter = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  return (
    <>
      <Button onClick={swapPlayer} label="swap video/audio" />
      <div className="player-container">
        {player == "youtube" ? (
          <YoutubePlayer
            setCurTime={setCurTime}
            syncCounter={syncCounter}
            width={400}
            height={225}
          />
        ) : (
          <AudioPlayer
            curTime={curTime}
            setCurTime={setCurTime}
            syncCounter={syncCounter}
            stopCounter={stopCounter}
          />
        )}
      </div>
    </>
  );
}
