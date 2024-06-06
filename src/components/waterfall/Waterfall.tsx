import { useState, useEffect } from "react";

import { getNoteSpacingMap } from "../../etc/KeyboardUtils";
import { updateWindow } from "../../etc/MidiManipulation";
import { SimplifiedMidi } from "../../types/MidiTypes";

import Canvas from "./canvas/Canvas";

interface WaterfallProps {
  curTime: number;
  midiData: SimplifiedMidi;
}

function Waterfall({ curTime, midiData }: WaterfallProps) {
  const noteSpacing = getNoteSpacingMap(22);
  const noteWidth = 18; // for drawing, in pixels

  // size of window in seconds containing relevant notes, from curTime-windSize to curTime+windafter
  const windSize = 5;

  // active notes window defined by index
  const [windStart, setWindStart] = useState<number>(0);
  const [windEnd, setWindEnd] = useState<number>(0);

  useEffect(() => {
    const [newWindStart, newWindEnd] = updateWindow(
      curTime,
      midiData,
      windStart,
      windEnd,
      windSize
    );
    setWindStart(newWindStart);
    setWindEnd(newWindEnd);
  }, [curTime, midiData]);

  const draw = (context: CanvasRenderingContext2D, count: number) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = "#0E2F44";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = "#00abb4";
    const d = count % 1144;
    context.fillRect(10 + d, 10, 100, 100);
  };

  const draw2 = (
    context: CanvasRenderingContext2D,
    activeMidiData: SimplifiedMidi,
    windSize: number,
    noteSpacing: Map<number, number>,
    noteWidth: number
  ) => {
    // background
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.fillStyle = "#0E2F44";
    context.fillRect(0, 0, context.canvas.width, context.canvas.height);

    // draw all the notes
    for (const event of activeMidiData) {
      const noteHeight = Math.floor((event.offset - event.onset) / windSize);
      const xMin = noteSpacing.get(event.pitch);
      const yMin = windSize - event.offset;
      if (xMin !== undefined) {
        context.fillStyle = "#00abb4";
        context.fillRect(xMin, yMin, noteWidth, noteHeight);
      }
    }
  };

  return (
    <>
      <Canvas draw={draw} width="1144" height="300" />
    </>
  );
}

export default Waterfall;
