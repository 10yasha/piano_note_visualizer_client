import { useEffect, useRef } from "react";

import { SimplifiedMidi } from "../../../types/MidiTypes";

// import useCanvas from "./useCanvas";

interface CanvasProps {
  draw: (context: CanvasRenderingContext2D, count: number) => void;
  draw2: (
    context: CanvasRenderingContext2D,
    activeMidiData: SimplifiedMidi,
    windSize: number,
    noteSpacing: Map<number, number>,
    noteHalfWidth: number,
    curTime: number
  ) => void;
  width: number;
  height: number;
  curTime: number;
  activeMidiData: SimplifiedMidi;
  windSize: number;
  noteSpacing: Map<number, number>;
  noteHalfWidth: number;
}

function Canvas({
  draw,
  draw2,
  width,
  height,
  curTime,
  activeMidiData,
  windSize,
  noteSpacing,
  noteHalfWidth,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const contextRef = useRef(null);
  // const ref = useCanvas(draw, draw2);

  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        draw2(
          context,
          activeMidiData,
          windSize,
          noteSpacing,
          noteHalfWidth,
          curTime
        );
      }
    }
  }, [curTime, windSize, noteSpacing]);

  return <canvas ref={canvasRef} width={width} height={height} />;
}

export default Canvas;
