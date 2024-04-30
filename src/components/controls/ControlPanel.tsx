import React from "react";
import Button from "./Button";
import "./ControlPanel.css";

function ControlPanel({
  toggleAudioPlayback,
  isPlaying,
  duration,
  currentTime,
}: {
  toggleAudioPlayback: React.MouseEventHandler<HTMLDivElement>;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
}) {
  function secondsToHms(seconds: number) {
    if (!seconds) return "00m 00s";

    let duration = seconds;
    let hours = duration / 3600;
    duration = duration % 3600;

    let min = Math.floor(duration / 60);
    duration = duration % 60;

    let sec = Math.floor(duration);

    // add 0's to fill in timestamp (ex. 00m 12s)
    let display_sec = sec.toString();
    let display_min = min.toString();
    if (sec < 10) {
      display_sec = `0${sec}`;
    }
    if (min < 10) {
      display_min = `0${min}`;
    }

    if (Math.floor(hours) > 0) {
      return `${Math.floor(hours)}h ${display_min}m ${display_sec}s`;
    } else if (min == 0) {
      return `00m ${sec}s`;
    } else {
      return `${min}m ${sec}s`;
    }
  }

  return (
    <div className="control-panel">
      <div className="timer">{secondsToHms(currentTime)}</div>
      <Button toggleAudioPlayback={toggleAudioPlayback} isPlaying={isPlaying} />
      <div className="timer">{secondsToHms(duration)}</div>
    </div>
  );
}
export default ControlPanel;
