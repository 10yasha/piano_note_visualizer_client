import { Link } from "react-router-dom";
import { dummyRecords } from "../../DummyRecords";

export default function BrowsePage() {
  return (
    <div className="browse-page">
      <h1>Browse</h1>
      {dummyRecords.map((record) => (
        <Link key={record.uuid} to={`/browse/${record.ENname}`}>
          {record.ENname}
        </Link>
      ))}
    </div>
  );
}
