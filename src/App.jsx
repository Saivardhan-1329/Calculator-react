import { useReducer } from "react";
import "./App.css";
import DigitButton from "./Components/DigitButton";
import { OperatiionButton } from "./Components/OperationButton";
export const ACTIONS = {
  ADD_DIGIT: "add-didgit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-didgit",
  EVALUATE: "evaluate",
};
function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          CurrentOperand: payload.digit,
        };
      }
      if (payload.digit === "0" && state.CurrentOperand === "0") {
        return state;
      }
      if (payload.digit === "." && state.CurrentOperand.includes(".")) {
        return state;
      }
      return {
        ...state,
        CurrentOperand: `${state.CurrentOperand || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.CurrentOperand == null && state.PreviousOperand == null) {
        return state;
      }
      if (state.PreviousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          PreviousOperand: state.CurrentOperand,
          CurrentOperand: "",
        };
      }
      if (state.CurrentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      return {
        ...state,
        PreviousOperand: evaluate(state),
        operation: payload.operation,
        CurrentOperand: "",
      };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.EVALUATE:
      if (
        state.CurrentOperand == null ||
        state.operation == null ||
        state.PreviousOperand == null
      ) {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        PreviousOperand: null,
        operation: null,
        CurrentOperand: evaluate(state),
      };
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          CurrentOperand: null,
          operation: null,
        };
      }
      if (state.CurrentOperand == null) return state;
      if (state.CurrentOperand === 1) {
        return {
          ...state,
          CurrentOperand: "",
        };
      }
      return {
        ...state,
        CurrentOperand: state.CurrentOperand.slice(0, -1),
      };
  }
}
function evaluate({ CurrentOperand, PreviousOperand, operation }) {
  const prev = parseFloat(PreviousOperand);
  const curren = parseFloat(CurrentOperand);
  if (isNaN(prev) || isNaN(curren)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + curren;
      break;
    case "-":
      computation = prev - curren;
      break;
    case "*":
      computation = prev * curren;
      break;
    case "/":
      if (curren === 0) return "Error: Division by zero";
      computation = prev / curren;
      break;
  }
  return computation.toString();
}
const Integer_Formatter = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});
function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return Integer_Formatter.format(integer);
  return `${Integer_Formatter.format(integer)}.${decimal}`;
}
function App() {
  const [{ CurrentOperand, PreviousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );
  return (
    <>
      <div className="App1">
        <div className="output">
          <div className="previous-operand">
            {PreviousOperand} {operation}
          </div>
          <div className="current-operand">{CurrentOperand}</div>
        </div>
        <button
          className="span-two"
          onClick={() => dispatch({ type: ACTIONS.CLEAR })}
        >
          AC
        </button>
        <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
          DEL
        </button>
        <OperatiionButton operation="/" dispatch={dispatch} />
        <DigitButton digit="1" dispatch={dispatch} />
        <DigitButton digit="2" dispatch={dispatch} />
        <DigitButton digit="3" dispatch={dispatch} />
        <OperatiionButton operation="+" dispatch={dispatch} />
        <DigitButton digit="4" dispatch={dispatch} />
        <DigitButton digit="5" dispatch={dispatch} />
        <DigitButton digit="6" dispatch={dispatch} />
        <OperatiionButton operation="-" dispatch={dispatch} />
        <DigitButton digit="7" dispatch={dispatch} />
        <DigitButton digit="8" dispatch={dispatch} />
        <DigitButton digit="9" dispatch={dispatch} />
        <OperatiionButton operation="*" dispatch={dispatch} />
        <DigitButton digit="." dispatch={dispatch} />
        <DigitButton digit="0" dispatch={dispatch} />
        <button
          className="span-two"
          onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
        >
          =
        </button>
      </div>
    </>
  );
}

export default App;
