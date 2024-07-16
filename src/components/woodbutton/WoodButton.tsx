import "./WoodButton.css";

function WoodButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button className="btn" onClick={onClick}>
      {label}
    </button>
  );
}

export default WoodButton;
