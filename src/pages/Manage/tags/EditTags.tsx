import { useState } from "react";
import "./EditTags.css";

import { ExtraTag } from "../../../types/GeneralTypes";

export default function EditTags({
  tags,
  setTags,
}: {
  tags: ExtraTag[];
  setTags: (tags: ExtraTag[]) => void;
}) {
  const [newTag, setNewTag] = useState<string>("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim() !== "") {
      setTags([...tags, { id: -1, recordingId: -1, tag: newTag.trim() }]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="App">
      <div className="tag-input">
        {tags.map((tag, index) => (
          <div className="tag" key={index}>
            {tag.tag}
            <button type="button" onClick={() => handleRemoveTag(index)}>
              &times;
            </button>
          </div>
        ))}
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Press Enter to add tags"
        />
      </div>
    </div>
  );
}
