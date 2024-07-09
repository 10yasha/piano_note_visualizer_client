export type Player = "youtube" | "audio";

export type ExtraTag = {id: number, recordingId: number, tag: string};

export const recordingTypes = ["vgm", "op/ed", "jazz", "classical", "freestyle", "original"] as const;

export interface RecordingInfo {
  id: number;
  url: string;
  name: string;
  enName: string; // English
  jpName: string; // Japanese (potentially kanji, empty if japanese not applicable)
  jpHiraganaName: string; // Japanese (in hiragana, empty if JPname already in hiragana)
  type: typeof recordingTypes[number];
  mainTag: string;
  extraTags: ExtraTag[];
}

export function recordingDefaultFactory(): RecordingInfo {
  return {
    id: -1,
    url: "",
    name: "",
    enName: "",
    jpName: "",
    jpHiraganaName: "",
    type: "vgm",
    mainTag: "",
    extraTags: []
  }
}

// for drawing
export type NoteDrawingSpecs = {
  whiteNoteWidth: number; // pixels
  blackNoteWidth: number; // pixels
  whiteNoteColor: string;
  blackNoteColor: string;
};