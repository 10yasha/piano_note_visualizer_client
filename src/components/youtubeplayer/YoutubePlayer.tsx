import { useState, useRef, useEffect } from "react";
// import useScript from "../../etc/UseScript";
import YouTube, { YouTubeProps } from "react-youtube";

import "./YoutubePlayer.css";

// import starter_song from "../../../example/FFXIII Sabers Edge.mp3";
import { AudioPlayerProps } from "../../interfaces/Interfaces";

enum YTState {
  unstarted = -1,
  ended = 0,
  playing = 1,
  paused = 2,
  buffering = 3,
  cued = 5,
}

export default function YoutubePlayer({
  curTime,
  setCurTime,
  setAudioRecentlyToggled,
  isPlaying,
  setIsPlaying,
}: AudioPlayerProps) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && videoRef.current.getCurrentTime) {
      setCurTime(videoRef.current.getCurrentTime());
    }
  });

  const onPlayerReady: YouTubeProps["onReady"] = (e) => {
    // access to player in all event handlers via event.target
    // event.target.pauseVideo();
    videoRef.current = e.target;
    console.log("youtube ready");
  };

  const onPlayerStateChange: YouTubeProps["onStateChange"] = (e) => {
    if (e.data == YTState.playing) {
      console.log("youtube playing");
      setIsPlaying(true);
      setAudioRecentlyToggled(true, true);
    } else if (e.data == YTState.paused) {
      console.log("youtube paused");
      setIsPlaying(false);
      setAudioRecentlyToggled(true, false);
    }
  };

  const opts: YouTubeProps["opts"] = {
    height: "225",
    width: "400",
    // https://developers.google.com/youtube/player_parameters
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <>
      <YouTube
        // videoId="YtZh3ydBZLA"
        videoId="faP8gKBuErg"
        opts={opts}
        onReady={onPlayerReady}
        onStateChange={onPlayerStateChange}
      />
    </>
  );
}
