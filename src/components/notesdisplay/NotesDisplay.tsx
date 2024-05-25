import { midiNumToName } from "../../etc/KeyboardUtils";

export default function NotesDisplay({ curNotes }: { curNotes: number[] }) {
  return (
    <div className="current-notes">
      {curNotes.length !== 0 ? (
        <h3>
          {curNotes
            .map((noteNum: number) => {
              return midiNumToName.get(noteNum);
            })
            .join(", ")}
        </h3>
      ) : (
        <h3>current notes here</h3>
      )}
    </div>
  );
}
