import { useState, useRef, useEffect } from "react";
import "./Slider.css";
import "./Thumb.css";

export default function Slider({
  percentage = 0,
  onChange,
}: {
  percentage: number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) {
  const [position, setPosition] = useState<number>(0);
  const [marginLeft, setMarginLeft] = useState<number>(0);
  const [progressBarWidth, setProgressBarWidth] = useState<number>(0);

  const rangeRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rangeRef.current && thumbRef.current) {
      const rangeWidth = rangeRef.current.getBoundingClientRect().width;
      const thumbWidth = thumbRef.current.getBoundingClientRect().width;
      const centerThumb = (thumbWidth / 100) * percentage * -1;
      const centerProgressBar =
        thumbWidth +
        (rangeWidth / 100) * percentage -
        (thumbWidth / 100) * percentage;
      setPosition(percentage);
      setMarginLeft(centerThumb);
      setProgressBarWidth(centerProgressBar);
    }
  }, [percentage]);

  return (
    <div className="slider-container">
      <div
        className="progress-bar-cover"
        style={{
          width: `${progressBarWidth}px`,
        }}
      ></div>
      <div
        className="thumb"
        ref={thumbRef}
        style={{
          left: `${position}%`,
          marginLeft: `${marginLeft}px`,
        }}
      ></div>
      <input
        type="range"
        value={position}
        ref={rangeRef}
        step="0.01"
        className="range"
        onChange={onChange}
      />
    </div>
  );
}
