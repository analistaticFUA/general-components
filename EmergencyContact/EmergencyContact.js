import React from "react";
import LabelOneField from "../LabelOneField/LabelOneField";
import LabelOneSelect from "../LabelOneSelect/LabelOneSelect";

function EmergencyContact( props ) {

  return (
    <div className="form-box">
      <h3>Contacto de Emergencia</h3>
      
      <LabelOneField
        labelText={"Nombre Completo: "}
        inputId={"emergency_contact_name"}
        inputPlaceholder={"Nombre del Contacto de Emergencia"}
        inputType={"text"}
        required={true}
        minLength={5}
        defaultValue={
          props.userData.emergency_contact_name === "N/A"
            ? null
            : props.userData.emergency_contact_name
        }
      />

      <div className="two-field-container">
        <LabelOneField
          labelText={"Número Contacto: "}
          inputId={"emergency_contact_number"}
          inputPlaceholder={"Número del Contacto de Emergencia"}
          inputType={"number"}
          required={true}
          minLength={5}
          defaultValue={
            props.userData.emergency_contact_number === "N/A"
              ? null
              : props.userData.emergency_contact_number
          }
        />

        <LabelOneSelect
          labelText={"Parentesco:"}
          selectText={"Seleccione el parentesco"}
          selectId={'emergency_contact_relationship'}
          initialOptions={props.relationship}
          required={true}
          defaultValue={
            props.userData.emergency_contact_relationship
            === "N/A"
              ? null
              : props.userData.emergency_contact_relationship
          }
        />
      </div>
    </div>
  );
}

export default EmergencyContact;
