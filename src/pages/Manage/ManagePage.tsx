import { Link } from "react-router-dom";
import { useState } from "react";

import { useAllRecordings } from "../../hooks/useAllRecordings";
import {
  addRecording,
  deleteRecording,
  updateMainRecordingInfo,
  updateExtraTags,
} from "./ManageApiHelper";

import EditTags from "./tags/EditTags";

import {
  extraTag,
  recordingDefaultFactory,
  RecordingInfo,
  recordingTypes,
} from "../../types/GeneralTypes";

import "./ManagePage.css";

export default function ManagePage() {
  const { records, fetchRecordings } = useAllRecordings();

  const [formData, setFormData] = useState<RecordingInfo>(
    recordingDefaultFactory()
  );

  const setTags = (tags: extraTag[]) => {
    setFormData({
      ...formData,
      extraTags: tags,
    });
  };

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // prevent pressing enter from submitting form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleCreate = async () => {
    await addRecording(formData);
    fetchRecordings();
  };

  return (
    <div className="manage-page">
      <div className="create-recording">
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
          <div>
            <label>Url:</label>
            <input
              type="text"
              name="url"
              value={formData.url}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Full Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>EN Name:</label>
            <input
              type="text"
              name="enName"
              value={formData.enName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>JP Name:</label>
            <input
              type="text"
              name="jpName"
              value={formData.jpName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Hiragana Name:</label>
            <input
              type="text"
              name="jpHiraganaName"
              value={formData.jpHiraganaName}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Type:</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              {recordingTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Source:</label>
            <input
              type="text"
              name="mainTag"
              value={formData.mainTag}
              onChange={handleChange}
            />
          </div>
          <EditTags tags={formData.extraTags} setTags={setTags} />
          <button type="submit" onClick={handleCreate}>
            Create
          </button>
        </form>
      </div>
      <div className="edit-recordings">
        <div className="scroll-container">
          {records &&
            records.map((record) => (
              <div className="row" key={record.id}>
                <Link to={`/browse/${record.url}`}>{record.name}</Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
