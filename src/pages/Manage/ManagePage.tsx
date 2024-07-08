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
  const records = useAllRecordings();

  const [formData, setFormData] = useState<RecordingInfo>(
    recordingDefaultFactory()
  );

  const setTags = (tags: extraTag[]) => {
    setFormData({
      ...formData,
      extraTags: tags,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.split(","),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data:", formData);
    addRecording(formData);
  };

  return (
    <div className="manage-page">
      <div className="create-recording">
        <form onSubmit={handleSubmit}>
          <div>
            <label>Url:</label>
            <input
              type="text"
              name="url"
              value={formData.url}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Full Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>EN Name:</label>
            <input
              type="text"
              name="enName"
              value={formData.enName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>JP Name:</label>
            <input
              type="text"
              name="jpName"
              value={formData.jpName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Hiragana Name:</label>
            <input
              type="text"
              name="jpHiraganaName"
              value={formData.jpHiraganaName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Type:</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleSelectChange}
            >
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
              onChange={handleInputChange}
            />
          </div>
          <EditTags tags={formData.extraTags} setTags={setTags} />
          <button type="submit">Create</button>
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
