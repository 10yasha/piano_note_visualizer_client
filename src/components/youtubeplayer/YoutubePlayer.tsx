import { useState, useRef, useEffect } from "react";
import YouTube, { YouTubeProps, YouTubePlayer } from "react-youtube";

import "./YoutubePlayer.css";

enum YTState {
  unstarted = -1,
  ended = 0,
  playing = 1,
  paused = 2,
  buffering = 3,
  cued = 5,
}

interface YoutubePlayerProps {
  setCurTime: React.Dispatch<React.SetStateAction<number>>;
  syncCounter: (isPlaying: boolean) => void;
  width: number;
  height: number;
}

export default function YoutubePlayer({
  setCurTime,
  syncCounter,
  width,
  height,
}: YoutubePlayerProps) {
  const videoRef = useRef<YouTubePlayer | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      setCurTime(videoRef.current.getCurrentTime());
    }
  });

  const onPlayerReady: YouTubeProps["onReady"] = (e) => {
    videoRef.current = e.target;
    console.log("youtube ready");
  };

  const onPlayerStateChange: YouTubeProps["onStateChange"] = (e) => {
    if (e.data == YTState.playing) {
      console.log("youtube playing");
      syncCounter(true);
    } else if (e.data == YTState.paused) {
      console.log("youtube paused");
      syncCounter(false);
    }
  };

  const opts: YouTubeProps["opts"] = {
    height: height,
    width: width,
    // https://developers.google.com/youtube/player_parameters
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <>
      <YouTube
        videoId="faP8gKBuErg" // saber's edge currently
        // videoId=""
        opts={opts}
        onReady={onPlayerReady}
        onStateChange={onPlayerStateChange}
      />
    </>
  );
}
