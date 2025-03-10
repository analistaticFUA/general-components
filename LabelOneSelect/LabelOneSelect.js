import React, { useState, useEffect } from "react";
import "../../assets/stylesheets/LabelOneSelect.css";

const LabelOneSelect = ({
  initialOptions,
  labelText,
  selectText,
  required,
  selectId,
  onChange,
  disabled,
  defaultValue,
}) => {
  const [selectedOption, setSelectedOption] = useState(defaultValue || "");

  useEffect(() => {
    setSelectedOption(defaultValue || "");
  }, [defaultValue]);

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue);
    if (onChange) {
      onChange(selectedValue); // Pasa el valor directamente como una cadena
    }
  };

  const options = initialOptions.map((option, index) => {
    if (typeof option === "string") {
      return { label: option, value: option };
    } else if (
      typeof option === "object" &&
      option !== null &&
      "value" in option &&
      "label" in option
    ) {
      return option;
    } else {
      console.error("Option format is not recognized:", option);
      return { label: `Invalid Option ${index}`, value: `invalid-${index}` };
    }
  });

  return (
    <div className="select-label-container">
      <div>
        <label htmlFor={selectId}>{labelText}</label>
      </div>
      <div className="select-container">
        <select
          id={selectId}
          value={selectedOption}
          onChange={handleSelectChange}
          required={required}
          name={selectId}
          disabled={disabled}
        >
          <option value="" disabled>
            {selectText}
          </option>
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LabelOneSelect;
