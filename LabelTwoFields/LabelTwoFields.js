import React, { useState } from "react";
import "../../assets/stylesheets/LabelOneField.css";

/*Este componente provee DOS label con sus respectivos inputs*/
function LabelTwoFields( props ) {
  const [validationErrors, setValidationErrors] = useState({
    input1: "",
    input2: "",
  });

  const handleKeyDown = (event) => {
    if (props.inputType === "text") {
      return;
    }
    // Permite solo caracteres numéricos (0-9)
    if (!/[0-9]/.test(event.key) && event.key !== "Backspace") {
      event.preventDefault();
    }
  };

  const handleInputChange = (event, name, minLength, maxLength, pattern) => {
    const value = event.target.value;
    let error = "";
    if ( props.required && value.trim() === "") {
      error = "Este campo es obligatorio.";
    } else if (minLength && value.length < minLength) {
      error = "La información ingresada es demasiado corta.";
    } else if (maxLength && value.length > maxLength) {
      error = "La información ingresada es demasiado larga.";
    } else if (pattern && !RegExp(pattern).test(value)) {
      error = "La información ingresada no es válida.";
    }
    setValidationErrors((prevState) => ({ ...prevState, [name]: error }));
  };

  return (
    <div className="two-field-container">
      <div className="one-field-container">
        <label htmlFor={props.inputId}>{props.labelText}</label>
        <input
          id={props.inputId}
          type={props.inputType}
          placeholder={props.inputPlaceholder}
          required={props.required}
          name={props.inputId}
          readOnly={props.readOnly}
          disabled={props.disabled}
          defaultValue={props.defaultValue}
          value={props.value}
          min={props.inputType === "number" ? "0" : undefined}
          minLength={props.minLength}
          maxLength={props.maxLength}
          pattern={props.pattern}
          onChange={(event) =>
            handleInputChange(event, "input1", props.minLength, props.maxLength, props.pattern)
          }
          onKeyDown={(event) => handleKeyDown(event, props.inputType)}
        />
        {validationErrors.input1 && (
          <div className="error-message">
            {props.inputPlaceholder + ": " + validationErrors.input1}
          </div>
        )}
      </div>

      <div className="one-field-container">
        <label htmlFor={props.inputId2}>{props.labelText2}</label>
        <input
          id={props.inputId2}
          type={props.inputType2}
          placeholder={props.inputPlaceholder2}
          name={props.inputId2}
          readOnly={props.readOnly}
          disabled={props.disabled}
          required={props.required2}
          minLength={props.minLength2}
          maxLength={props.maxLength2}
          defaultValue={props.defaultValue2}
          value={props.value2}
          pattern={props.pattern2}
          onChange={(event) =>
            handleInputChange(event, "input2", props.minLength2, props.maxLength2, props.pattern2)
          }
          min={props.inputType2 === "number" ? "0" : undefined}
          onKeyDown={(event) => handleKeyDown(event, props.inputType2)}
        />
        {validationErrors.input2 && (
          <div className="error-message">
            {props.inputPlaceholder2 + ": " + validationErrors.input2}
          </div>
        )}
      </div>
    </div>
  );
}

export default LabelTwoFields;
