import { useState, useRef } from "react";

import Draggable from "react-draggable";

import AudioPlayer from "./audioplayer/AudioPlayer";
import YoutubePlayer from "./youtubeplayer/YoutubePlayer";
import { Player } from "../../types/GeneralTypes";
import WoodButton from "../woodbutton/WoodButton";

import "./MusicPlayer.css";

interface MusicPlayerProps {
  curTime: number;
  setCurTime: React.Dispatch<React.SetStateAction<number>>;
  setAudioRecentlyToggled: React.Dispatch<React.SetStateAction<boolean>>;
  youtubeUrl: string;
}

export default function MusicPlayer({
  curTime,
  setCurTime,
  setAudioRecentlyToggled,
  youtubeUrl,
}: MusicPlayerProps) {
  const [player, setPlayer] = useState<Player>("youtube");
  const intervalRef = useRef<number | null>(null);
  const counterIncrement = 10; // milliseconds, rate at which time will update

  const swapPlayer = () => {
    if (player == "youtube") {
      setPlayer("audio");
    } else if (player == "audio") {
      setPlayer("youtube");
    }
  };

  const syncCounter = (isPlaying: boolean) => {
    console.debug("counter stopped");
    stopCounter();
    if (isPlaying) {
      console.debug("counter restarted");
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
      <Draggable handle="strong">
        <div className="box no-cursor">
          <strong className="cursor">
            <div>try dragging here!</div>
          </strong>
          <div>
            <div className="btn-swap">
              <WoodButton onClick={swapPlayer} label="swap video/audio" />
            </div>
            <div className="player-container">
              {player == "youtube" ? (
                <YoutubePlayer
                  youtubeUrl={youtubeUrl}
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
          </div>
        </div>
      </Draggable>
    </>
  );
}
