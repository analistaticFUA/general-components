import React from "react";
import LabelOneSelect from "../LabelOneSelect/LabelOneSelect";

function EndowmentInformation( props ){

  const admins = 'Administrativos';
  const shoesSizes = props.shoesSizes;
  const shirtSizes = props.shirtSizes;

  shoesSizes.sort((a,b) => a - b);
  shirtSizes.sort();

  return(
    <div className="form-box">
        <h3>{props.nameBox}</h3>
        <div className="three-fields-container">
          <LabelOneSelect 
            labelText={"Talla Pantalón: "}
            selectText={"Seleccione su talla de Pantalón"}
            initialOptions= {props.sizeOptions}
            selectId={'pant_size'}
            required={props.userData?.employee_project!== admins}
            defaultValue={props.userData?.pant_size === 'N/A'
              ? null
              : props.userData.pant_size
            }
          />

          <LabelOneSelect 
            labelText={"Talla Camisa: "}
            selectText={"Seleccione su talla Camisa"}
            selectId={'shirt_size'}
            required={props.userData?.employee_project !== admins}
            initialOptions={shirtSizes}
            defaultValue={props.userData?.shirt_size === 'N/A'
              ? null
              : props.userData.shirt_size
            }
          />

          <LabelOneSelect 
            labelText={"No. Calzado: "}
            selectText={"Seleccione su talla de Calzado"}
            selectId={'shoes_size'}
            required={props.userData?.employee_project !== admins}
            initialOptions={shoesSizes}
            defaultValue={props.userData?.shoes_size === 'N/A'
              ? null
              : props.userData.shoes_size
             }
          />
        </div>
    </div>
  );
}

export default EndowmentInformation;