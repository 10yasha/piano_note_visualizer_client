import React from "react";
import "./Button.css";

function Button({
  play,
  isPlaying,
}: {
  play: React.MouseEventHandler<HTMLDivElement>;
  isPlaying: boolean;
}) {
  return (
    <div className="btn-container">
      <div onClick={play} className={isPlaying ? "btn-stop" : "btn-play"}></div>
    </div>
  );
}
export default Button;
