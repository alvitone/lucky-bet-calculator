import { useNavigate } from "react-router-dom";
import "./LuckySelect.css";

function LuckySelect() {
  const navigate = useNavigate();

  const luckyNumbers = [7, 15, 31, 63];

  return (
    <div className="lucky-container">
      <h1>Lucky Bet Calculator</h1>

      <div className="button-grid">
        {luckyNumbers.map((num) => (
          <button
            key={num}
            onClick={() => navigate(`/calculator/${num}`)}
          >
            Lucky {num}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LuckySelect;
