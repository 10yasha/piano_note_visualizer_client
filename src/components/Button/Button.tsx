import "./Button.css";

function Button({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button className="btn" onClick={onClick}>
      {label}
    </button>
  );
}

export default Button;
