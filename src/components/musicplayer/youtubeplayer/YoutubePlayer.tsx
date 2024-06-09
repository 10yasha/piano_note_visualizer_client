import { useRef, useEffect } from "react";
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

  const updateCurTime = async () => {
    if (videoRef.current) {
      setCurTime(await videoRef.current.getCurrentTime());
    }
  };

  // TODO, react to youtube time change even when video isn't playing!
  // videoRef.current.getIframe
  // https://stackoverflow.com/questions/65511523/how-to-listen-to-time-change-events-with-the-youtube-iframe-player-api/65511524#65511524

  useEffect(() => {
    updateCurTime();
  });

  const onPlayerReady: YouTubeProps["onReady"] = (e) => {
    videoRef.current = e.target;
    console.debug("youtube ready");
    updateCurTime();
  };

  const onPlayerStateChange: YouTubeProps["onStateChange"] = (e) => {
    if (e.data == YTState.playing) {
      console.debug("youtube playing");
      syncCounter(true);
    } else if (e.data == YTState.paused) {
      console.debug("youtube paused");
      syncCounter(false);
    }
  };

  const onPlayerEnd: YouTubeProps["onEnd"] = () => {
    console.debug("youtube ended");
    syncCounter(false);
  };

  const onPlayerError: YouTubeProps["onError"] = (e) => {
    console.error("youtube error:", e);
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
      <div className="youtube-player">
        <YouTube
          videoId="faP8gKBuErg" // saber's edge
          // videoId="_HZRiwDz-9M" // color your night
          // videoId="tW9Alr38Ha0" // test vid so I'm not adding too many views to my own vids
          opts={opts}
          onReady={onPlayerReady}
          onStateChange={onPlayerStateChange}
          onEnd={onPlayerEnd}
          onError={onPlayerError}
        />
      </div>
    </>
  );
}
