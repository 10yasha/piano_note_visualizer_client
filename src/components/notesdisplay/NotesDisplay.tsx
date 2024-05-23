export default function NotesDisplay({ curNotes }: { curNotes: string }) {
  return (
    <div className="current-notes">
      {curNotes.length !== 0 ? (
        <h3>{curNotes}</h3>
      ) : (
        <h3>current notes here</h3>
      )}
    </div>
  );
}
