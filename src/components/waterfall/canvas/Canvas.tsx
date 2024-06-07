import { useEffect, useRef } from "react";

import { SimplifiedMidi } from "../../../types/MidiTypes";
import { NoteDrawingSpecs } from "../../../types/GeneralTypes";

// import useCanvas from "./useCanvas";

interface CanvasProps {
  draw: (
    context: CanvasRenderingContext2D,
    activeMidiData: SimplifiedMidi,
    windSize: number,
    noteSpacingMap: Map<number, number>,
    noteSpecs: NoteDrawingSpecs,
    keyIsWhiteMap: Map<number, boolean>,
    curTime: number
  ) => void;
  width: number;
  height: number;
  curTime: number;
  activeMidiData: SimplifiedMidi;
  windSize: number;
  noteSpacingMap: Map<number, number>;
  noteSpecs: NoteDrawingSpecs;
  keyIsWhiteMap: Map<number, boolean>;
}

function Canvas({
  draw,
  width,
  height,
  curTime,
  activeMidiData,
  windSize,
  noteSpacingMap,
  noteSpecs,
  keyIsWhiteMap,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        draw(
          context,
          activeMidiData,
          windSize,
          noteSpacingMap,
          noteSpecs,
          keyIsWhiteMap,
          curTime
        );
      }
    }
  }, [curTime, windSize, noteSpacingMap]);

  return <canvas ref={canvasRef} width={width} height={height} />;
}

export default Canvas;
