import React from "react";
import "./Button.css";

function Button({
  toggleAudioPlayback,
  isPlaying,
}: {
  toggleAudioPlayback: React.MouseEventHandler<HTMLDivElement>;
  isPlaying: boolean;
}) {
  return (
    <div className="btn-container">
      <div
        onClick={toggleAudioPlayback}
        className={isPlaying ? "btn-stop" : "btn-play"}
      ></div>
    </div>
  );
}
export default Button;
