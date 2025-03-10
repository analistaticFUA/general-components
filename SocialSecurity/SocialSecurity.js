import React from "react";
import LabelOneSelect from "../LabelOneSelect/LabelOneSelect";
import LabelOneField from "../LabelOneField/LabelOneField";


function SocialSecurity(props) {
  return (
    <div className="form-box">
      <h3>{props.nameBox}</h3>

      <LabelOneSelect
        labelText="EPS: "
        selectText="Seleccione su EPS"
        selectId={"eps"}
        required={true}
        initialOptions={props.epsOptions}
        defaultValue={props.userData?.eps}
      />

      <LabelOneField 
        labelText={"IPS"}
        inputId={"ips"}
        inputType="text"
        inputPlaceholder="Nombre IPS"
        defaultValue={
          props.userData.ips === "N/A"
            ? null
            : props.userData.ips
        }
      
      />

      <LabelOneSelect
        labelText="Fondo de Pensión: "
        selectText="Seleccione su Fondo de Pensiones"
        selectId={"pension"}
        required={true}
        initialOptions={props.afpOptions}
        defaultValue={props.userData?.pension}
      />

      <LabelOneSelect
        labelText="Cesantías: "
        selectText="Seleccione su Fondo de Cesantías"
        selectId={"severance"}
        required={true}
        initialOptions={props.severanceOptions}
        defaultValue={props.userData?.severance}
      />
    </div>
  );
}

export default SocialSecurity;
