import { useEffect, useRef } from "react";

import { SimplifiedMidi } from "../../../types/MidiTypes";
import { NoteDrawingSpecs } from "../../../types/GeneralTypes";

// import useCanvas from "./useCanvas";

interface CanvasProps {
  draw: (
    context: CanvasRenderingContext2D,
    activeMidiData: SimplifiedMidi,
    windSize: number,
    noteSpacing: Map<number, number>,
    noteSpecs: NoteDrawingSpecs,
    curTime: number
  ) => void;
  width: number;
  height: number;
  curTime: number;
  activeMidiData: SimplifiedMidi;
  windSize: number;
  noteSpacing: Map<number, number>;
  noteSpecs: NoteDrawingSpecs;
}

function Canvas({
  draw,
  width,
  height,
  curTime,
  activeMidiData,
  windSize,
  noteSpacing,
  noteSpecs,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const contextRef = useRef(null);
  // const ref = useCanvas(draw, draw2);

  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        draw(
          context,
          activeMidiData,
          windSize,
          noteSpacing,
          noteSpecs,
          curTime
        );
      }
    }
  }, [curTime, windSize, noteSpacing]);

  return <canvas ref={canvasRef} width={width} height={height} />;
}

export default Canvas;
