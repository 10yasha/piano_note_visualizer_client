import { Link } from "react-router-dom";

import { useAllRecordings } from "../../hooks/useAllRecordings";
import { addRecording } from "./ManageApiHelper";

import "./ManagePage.css";

export default function ManagePage() {
  const records = useAllRecordings();

  return (
    <div className="manage-page">
      <div className="create-recording-panel">
        <p>create here</p>
      </div>
      <div className="edit-recordings-panel">
        <div className="scroll-container">
          {records &&
            records.map((record) => (
              <div className="row">
                <Link key={record.id} to={`/browse/${record.url}`}>
                  {record.name}
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
