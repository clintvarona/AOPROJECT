import React, { useState } from "react";
import "../index.css";
import QuadraticCalculator from "./QuadraticCalculator";

// Button layout for iPhone calculator
const buttons = [
  ["AC", "+/-", "%", "/"],
  ["7", "8", "9", "x"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "+"],
  ["0", ".", "="]
];

const getButtonClass = (btn: string) => {
  if (["/", "x", "-", "+", "="] .includes(btn)) return "op-btn";
  if (["AC", "+/-", "%"].includes(btn)) return "func-btn";
  if (btn === "0") return "zero-btn";
  return "num-btn";
};

const IphoneCalculator: React.FC = () => {
  const [mode, setMode] = useState<'standard' | 'quadratic'>('standard');
  const [display, setDisplay] = useState("0");
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [process, setProcess] = useState<string>("");
  const [expression, setExpression] = useState<string>("");
  const [justEvaluated, setJustEvaluated] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand || justEvaluated) {
      setDisplay(num);
      setWaitingForOperand(false);
      setJustEvaluated(false);
      setProcess((prev) => prev + num);
      setExpression((prev) => prev + num);
    } else {
      setDisplay(display === "0" ? num : display + num);
      setProcess((prev) => (display === "0" ? num : prev + num));
      setExpression((prev) => (display === "0" ? num : prev + num));
    }
  };

  const inputDot = () => {
    if (waitingForOperand || justEvaluated) {
      setDisplay("0.");
      setWaitingForOperand(false);
      setJustEvaluated(false);
      setProcess((prev) => prev + "0.");
      setExpression((prev) => prev + "0.");
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
      setProcess((prev) => prev + ".");
      setExpression((prev) => prev + ".");
    }
  };

  const clearAll = () => {
    setDisplay("0");
    setOperator(null);
    setFirstOperand(null);
    setWaitingForOperand(false);
    setProcess("");
    setExpression("");
    setJustEvaluated(false);
  };

  const toggleSign = () => {
    setDisplay((parseFloat(display) * -1).toString());
    setProcess((prev) => {
      const match = prev.match(/(-?\d*\.?\d*)$/);
      if (match) {
        const neg = (parseFloat(match[0]) * -1).toString();
        return prev.slice(0, -match[0].length) + neg;
      }
      return prev;
    });
    setExpression((prev) => {
      const match = prev.match(/(-?\d*\.?\d*)$/);
      if (match) {
        const neg = (parseFloat(match[0]) * -1).toString();
        return prev.slice(0, -match[0].length) + neg;
      }
      return prev;
    });
  };

  const inputPercent = () => {
    setDisplay((parseFloat(display) / 100).toString());
    setProcess((prev) => {
      const match = prev.match(/(\d*\.?\d*)$/);
      if (match) {
        const percent = (parseFloat(match[0]) / 100).toString();
        return prev.slice(0, -match[0].length) + percent;
      }
      return prev;
    });
    setExpression((prev) => {
      const match = prev.match(/(\d*\.?\d*)$/);
      if (match) {
        const percent = (parseFloat(match[0]) / 100).toString();
        return prev.slice(0, -match[0].length) + percent;
      }
      return prev;
    });
  };

  const performOperation = (nextOperator: string) => {
    if (justEvaluated) {
      setProcess(display + nextOperator);
      setExpression(display + nextOperator);
      setJustEvaluated(false);
    } else {
      setProcess((prev) => prev + nextOperator);
      setExpression((prev) => prev + nextOperator);
    }
    setOperator(nextOperator);
    setWaitingForOperand(true);
  };

  const safeEval = (expr: string) => {
    // Replace x with * for multiplication
    const sanitized = expr.replace(/x/g, '*');
    try {
      // eslint-disable-next-line no-eval
      return Function('return ' + sanitized)();
    } catch {
      return 'Error';
    }
  };

  const handleButtonClick = (btn: string) => {
    if (/^[0-9]$/.test(btn)) inputNumber(btn);
    else if (btn === ".") inputDot();
    else if (["+", "-", "x", "/"].includes(btn)) performOperation(btn);
    else if (btn === "=") {
      if (expression) {
        const result = safeEval(expression);
        setDisplay(result.toString());
        setProcess(expression + "=" + result);
        setExpression("");
        setOperator(null);
        setFirstOperand(null);
        setWaitingForOperand(false);
        setJustEvaluated(true);
      }
    } else if (btn === "AC") clearAll();
    else if (btn === "+/-") toggleSign();
    else if (btn === "%") inputPercent();
  };

  if (mode === 'quadratic') {
    return (
      <div className="iphone-calc-container">
        <button
          className="quadratic-toggle-btn quadratic-mode"
          onClick={() => setMode('standard')}
        >
          Standard Calc
        </button>
        <QuadraticCalculator />
      </div>
    );
  }

  return (
    <div className="iphone-calc-container">
      <button
        className="quadratic-toggle-btn"
        onClick={() => setMode('quadratic')}
      >
        Quadratic
      </button>
      <div className="iphone-calc-process">{process}</div>
      <div className="iphone-calc-display">{parseFloat(display).toLocaleString("en", { maximumFractionDigits: 8 })}</div>
      <div className="iphone-calc-buttons">
        {buttons.map((row, i) => (
          <div className="iphone-calc-row" key={i}>
            {row.map((btn, j) => (
              <button
                key={btn}
                className={`iphone-calc-btn ${getButtonClass(btn)}`}
                onClick={() => handleButtonClick(btn)}
                style={btn === "0" ? { gridColumn: "span 2" } : {}}
              >
                {btn}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default IphoneCalculator;

