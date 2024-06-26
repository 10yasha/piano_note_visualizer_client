import { useParams } from "react-router-dom";

export default function Visualizer() {
  const params = useParams<{ recordENname: string }>();
  return (
    <div className="visualizer">
      <h1>Visualizer</h1>
      <p>{params.recordENname}</p>
    </div>
  );
}
