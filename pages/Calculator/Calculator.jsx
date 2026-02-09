import { useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import "./Calculator.css";

const LUCKY_SELECTION_MAP = {
  7: 3,
  15: 4,
  31: 5,
  63: 6,
};

function Calculator() {
  const { count } = useParams(); // 7 | 15 | 31 | 63
  const luckyType = Number(count);
  const selectionCount = LUCKY_SELECTION_MAP[luckyType];

  /* ================= STATE ================= */

  const [selections, setSelections] = useState(
    Array.from({ length: selectionCount }, (_, i) => ({
      id: String.fromCharCode(65 + i), // A, B, C...
      odds: "",
      result: "win", // win | loss | void
    }))
  );

  const [totalStake, setTotalStake] = useState(0);

  const updateSelection = (index, field, value) => {
    setSelections((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  /* ================= LUCKY BET ENGINE ================= */

  const generateCombinations = (items) => {
    const result = [];
    const helper = (start, combo) => {
      if (combo.length > 0) result.push([...combo]);
      for (let i = start; i < items.length; i++) {
        combo.push(items[i]);
        helper(i + 1, combo);
        combo.pop();
      }
    };
    helper(0, []);
    return result;
  };

  const calculation = useMemo(() => {
    if (!totalStake) {
      return { totalBets: 0, stakePerLine: 0, totalReturn: 0, profit: 0 };
    }

    const combinations = generateCombinations(selections);
    const totalBets = combinations.length;
    const stakePerLine = totalStake / totalBets;

    let totalReturn = 0;

    combinations.forEach((combo) => {
      let oddsProduct = 1;

      for (const sel of combo) {
        if (sel.result === "loss") return;
        oddsProduct *= sel.result === "void" ? 1 : Number(sel.odds || 0);
      }

      totalReturn += stakePerLine * oddsProduct;
    });

    return {
      totalBets,
      stakePerLine,
      totalReturn,
      profit: totalReturn - totalStake,
    };
  }, [selections, totalStake]);

  /* ================= UI ================= */

  return (
    <div className="calculator-container">
      <div className="calculator-left">
        <h3>Lucky {luckyType} Bet Calculator</h3>

        <div className="table">
          {selections.map((sel, index) => (
            <div className="row" key={index}>
              <span className="label">{sel.id}</span>

              {/* Odds – trigger on BLUR */}
              <input
                type="number"
                placeholder="Odds"
                defaultValue={sel.odds}
                onBlur={(e) =>
                  updateSelection(index, "odds", e.target.value)
                }
              />

              {/* Result – trigger on CHANGE */}
              <select
                defaultValue={sel.result}
                onChange={(e) =>
                  updateSelection(index, "result", e.target.value)
                }
              >
                <option value="win">Win</option>
                <option value="loss">Loss</option>
                <option value="void">Void</option>
              </select>
            </div>
          ))}
        </div>

        {/* Total stake – trigger on BLUR */}
        <div className="stake">
          <label>Total Stake</label>
          <input
            type="number"
            placeholder="Total Stake"
            defaultValue={totalStake}
            onBlur={(e) =>
              setTotalStake(Number(e.target.value) || 0)
            }
          />
        </div>
      </div>

      <div className="calculator-right">
        <p className="title">Profit / Loss</p>

        <p
          className={`amount ${
            calculation.profit >= 0 ? "green" : "red"
          }`}
        >
          ₹{calculation.profit.toFixed(2)}
        </p>

        <p>Total Bets: {calculation.totalBets}</p>
        <p>Stake / Bet: ₹{calculation.stakePerLine.toFixed(2)}</p>
        <p>Total Return: ₹{calculation.totalReturn.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default Calculator;
