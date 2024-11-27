import React, { useState } from "react";

const Incomecalculate = () => {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [netIncome, setNetIncome] = useState(null);

  const handleCalculate = () => {
    setNetIncome(income - expenses);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Calculate Net Income</h2>

      <div style={{ marginBottom: "10px" }}>
        <label>
          Total Income:
          <input
            type="number"
            value={income}
            onChange={(e) => setIncome(parseFloat(e.target.value) || 0)} // Fix here
            style={{ marginLeft: "10px" }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>
          Total Expenses:
          <input
            type="number"
            value={expenses}
            onChange={(e) => setExpenses(parseFloat(e.target.value) || 0)} // Fix here
            style={{ marginLeft: "10px" }}
          />
        </label>
      </div>

      <button onClick={handleCalculate} style={{ padding: "5px 10px" }}>
        Calculate
      </button>

      {netIncome !== null && (
        <div style={{ marginTop: "20px" }}>
          <h3>Net Income: {netIncome.toFixed(2)}</h3>
        </div>
      )}
    </div>
  );
};

export default Incomecalculate;
