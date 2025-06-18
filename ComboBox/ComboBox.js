// ComboBox.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';

const ComboBox = ({
  initialOptions = [],
  onChange,
  selectId,
  defaultValue,
  selectText,
  required,
  disabled,
  onValidationChange,
  allowCustom = false,  // Nueva propiedad para permitir entradas personalizadas
}) => {
  const [inputValue, setInputValue] = useState(defaultValue || '');
  const [filteredOptions, setFilteredOptions] = useState(initialOptions);
  const [showOptions, setShowOptions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [error, setError] = useState(false);
  const optionsRef = useRef();

  const filterOptions = useCallback((value) => {
    const safeValue = value || '';
    const filtered = initialOptions.filter(option =>
      typeof option === 'string' && option.toLowerCase().includes(safeValue.trim().toLowerCase())
    );

    if (JSON.stringify(filtered) !== JSON.stringify(filteredOptions)) {
      setFilteredOptions(filtered);
    }

    setHighlightedIndex(-1);
  }, [initialOptions, filteredOptions]);

  useEffect(() => {
    filterOptions(inputValue);
  }, [inputValue, filterOptions]);

  useEffect(() => {
    setInputValue(defaultValue || '');
  }, [defaultValue]);
  
  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    setInputValue(value);
    setShowOptions(true);

    if (allowCustom) {  // Permitir entradas personalizadas
      setError(false);
      if (onChange) {
        onChange({ target: { value } });  // Asegurarse de que `onChange` actualice el valor correctamente en `newStudy`
      }
      if (onValidationChange) {
        onValidationChange(true);  // Entrada personalizada considerada válida
      }
    } else {
      const isValid = initialOptions.includes(value);
      setError(!isValid);  // Validar solo si no se permite personalizado
      if (onValidationChange) {
        onValidationChange(isValid);
      }
    }
  };

  const handleOptionClick = (option) => {
    setInputValue(option);
    setShowOptions(false);
    setHighlightedIndex(-1);
    setError(false);
    if (onChange) {
      onChange({ target: { value: option } });  // Actualizar el valor en `newStudy` con el cambio
    }
    if (onValidationChange) {
      onValidationChange(true);
    }
  };

  const handleBlur = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      const isValid = allowCustom || (Array.isArray(initialOptions) && initialOptions.includes(inputValue.trim()));
      setError(!isValid);
      if (onValidationChange) {
        onValidationChange(isValid);
      }
      setShowOptions(false);
    }
  };

  return (
    <div className="combo-box-container" onBlur={handleBlur}>
      <input
        type="text"
        id={selectId}
        value={inputValue}
        onChange={handleInputChange}
        placeholder={selectText}
        required={required}
        disabled={disabled}
        autoComplete="off"
        onFocus={() => setShowOptions(true)}
        aria-invalid={error}
        ref={optionsRef}
      />
      {showOptions && (
        <div className="option-container">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <div
                key={`${selectId}-${option}`}
                className={`option ${index === highlightedIndex ? 'highlighted' : ''}`}
                onMouseDown={() => handleOptionClick(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {option}
              </div>
            ))
          ) : (
            <div className="option">No se encontraron opciones</div>
          )}
        </div>
      )}
      {error && <div className="error-message">Seleccione una opción válida</div>}
    </div>
  );
};

export default ComboBox;