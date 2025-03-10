import React, { useState } from "react";
import "../../assets/stylesheets/LabelOneField.css";

/*Este componente provee UN label con su respectivo input*/
function LabelOneField({
  readOnly,
  labelText,
  inputId,
  inputType,
  inputPlaceholder,
  required,
  maxNumber,
  minLength,
  maxLength,
  pattern,
  defaultValue,
  disabled
}) {
  const [validationError, setValidationError] = useState("");

  const handleKeyDown = (event) => {
    // Permite solo caracteres numéricos (0-9)
    if (
      inputType === "number" &&
      !/[0-9]/.test(event.key) &&
      event.key !== "Backspace"
    ) {
      event.preventDefault();
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    // Validar el valor del input
    if (required && value.trim() === "") {
      setValidationError("Este campo es obligatorio");
    } else if (minLength && value.length < minLength) {
      setValidationError("La información ingresada es demasiada corta");
    } else if (maxLength && value.length > maxLength) {
      setValidationError("La información ingresada es demasiada larga");
    } else if (pattern && !RegExp(pattern).test(value)) {
      setValidationError("La información ingresada no es válida");
    } else if (maxNumber && value > maxNumber) {
      setValidationError(`Ingrese un número entre 0 y ${maxNumber}`);
    } else {
      setValidationError("");
    }
  };

  return (
    <div>
      <div className="one-field-container">
        <label htmlFor={inputId}>{labelText}</label>
        <input
          readOnly={readOnly}
          disabled={disabled}
          id={inputId}
          type={inputType}
          placeholder={inputPlaceholder}
          required={required}
          min={inputType === "number" ? "0" : undefined}
          max={maxNumber}
          minLength={minLength}
          maxLength={maxLength}
          pattern={pattern}
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
          name={inputId}
          defaultValue={defaultValue}
        />
        {validationError && (
          <div className="error-message">
            {validationError + ": " + inputPlaceholder}
          </div>
        )}
      </div>
    </div>
  );
}

export default LabelOneField;
