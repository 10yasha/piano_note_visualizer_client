import { useState, useEffect } from "react";

import { midiNumToName } from "../../etc/KeyboardUtils";
import "./Keyboard.css";

export default function Keyboard({ activeNotes }: { activeNotes: number[] }) {
  // const [pressedNotes, setPressedNotes] = useState<number[]>([]);

  useEffect(() => {
    [...midiNumToName.keys()].forEach((midiId) => {
      document.getElementById(midiId.toString())?.classList.remove("active");
    });

    activeNotes.forEach((midiId) => {
      document.getElementById(midiId.toString())?.classList.add("active");
    });
  }, [activeNotes]);

  return (
    <div className="keyboard">
      {Array.from(midiNumToName).map(([keyNum, noteName]) => {
        return (
          <div
            id={keyNum.toString()}
            className={(noteName.length == 3 ? "black" : "white") + " key"}
          ></div>
        );
      })}
    </div>
  );
}
