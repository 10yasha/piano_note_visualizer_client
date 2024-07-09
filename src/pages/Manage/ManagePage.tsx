import { useAllRecordings } from "../../hooks/useAllRecordings";

import Editor from "./editor/Editor";
import Manager from "./manager/Manager";

import "./ManagePage.css";

export default function ManagePage() {
  const { records, fetchRecordings } = useAllRecordings();

  return (
    <div className="manage-page">
      <div className="left">
        <Editor fetchRecordings={fetchRecordings} />
      </div>
      <div className="right">
        <Manager records={records} fetchRecordings={fetchRecordings} />
      </div>
    </div>
  );
}
