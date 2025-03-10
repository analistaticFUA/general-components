import React, { useState, useEffect, useRef } from "react";
import DateTime from "react-datetime";
import LabelOneField from "../LabelOneField/LabelOneField";
import "react-datetime/css/react-datetime.css";
import LabelOneSelect from "../LabelOneSelect/LabelOneSelect";
import UploadPicture from "../Uploads/UploadPicture";

function PersonalInformation(props) {
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedMunicipality, setSelectedMunicipality] = useState("");
  const [municipalities, setMunicipalities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(
    props.userData.birth_country === "N/A" ? "" : props.userData.birth_country
  );
  const isInitialized = useRef(false);
  const genders = ["Masculino", "Femenino", "Otro"];
  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "O+", "O-"];
  const bankAccountTypes = ["Cuenta de ahorro", "Cuenta corriente"];

  const handleGenderChange = (value) => {
    setSelectedGender(value);
    props.onGenderChange(value);
  };

  const handleCountryChange = (value) => {
    setSelectedCountry(value);
  };

  useEffect(() => {
    if (
      !isInitialized.current &&
      props.userData.birth_place &&
      props.statesData
    ) {
      const department = Object.keys(props.statesData).find((dept) =>
        props.statesData[dept].some(
          (city) => city.code === props.userData.birth_place
        )
      );

      if (department) {
        setSelectedDepartment(department);
        setMunicipalities(props.statesData[department]);
        setSelectedMunicipality(props.userData.birth_place);
        isInitialized.current = true;
      }
    }
  }, [props.userData.birth_place, props.statesData]);

  const handleDepartmentChange = (value) => {
    setSelectedDepartment(value);
    if (props.statesData && props.statesData[value]) {
      setMunicipalities(props.statesData[value]);
      setSelectedMunicipality("");
    } else {
      setMunicipalities([]);
    }
  };

  const handleMunicipalityChange = (value) => {
    setSelectedMunicipality(value);
  };

  const departmentOptions = props.statesData
    ? Object.keys(props.statesData).map((dept) => ({
        label: dept,
        value: dept,
      }))
    : [];

  const maritalStatusOptions = props.maritalStatus.map((status) => ({
    label: status[0],
    value: status[1],
  }));
  
  return (
    <div className="form-box">
      <h3>{props.nameBox}</h3>

      <UploadPicture
        labelText={"Foto tipo documento:"}
        username={props.userData.full_name}
        onImageChange={props.onImageChange}
      />

      <div className="box-date">
        <div className="one-field-container">
          <label htmlFor="birth_date">Fecha de Nacimiento: </label>
          <DateTime
            id="birth_date"
            inputProps={{
              placeholder: "aaaa-mm-dd",
              name: "birth_date",
              style: { fontFamily: "Work Sans" },
            }}
            initialValue={
              props.userData.birth_date || new Date().toISOString().slice(0, 10)
            }
            dateFormat="YYYY-MM-DD"
            timeFormat={false}
            required={true}
          />
        </div>

        <LabelOneSelect
          labelText={"País de Nacimiento:"}
          selectText={"Seleccione su país de nacimiento"}
          selectId={"birth_country"}
          initialOptions={props.countries}
          onChange={handleCountryChange}
          required={true}
          defaultValue={selectedCountry}
        />
      </div>

      <div>
        {selectedCountry === "Colombia" && (
          <div className="two-field-container">
            <LabelOneSelect
              labelText={"Departamento de Nacimiento:"}
              selectText={"Seleccione su departamento de nacimiento"}
              initialOptions={departmentOptions}
              onChange={handleDepartmentChange}
              required={true}
              defaultValue={selectedDepartment}
            />

            <LabelOneSelect
              labelText={"Municipio de Nacimiento:"}
              selectText={"Seleccione su ciudad de nacimiento"}
              selectId={"birth_place"}
              initialOptions={municipalities.map((city) => ({
                label: city.name,
                value: city.code,
              }))}
              required={true}
              onChange={handleMunicipalityChange}
              defaultValue={selectedMunicipality}
            />
          </div>
        )}
      </div>

      <div className="box-date">
        <LabelOneSelect
          labelText={"Grupo Sanguíneo:"}
          selectText={"Seleccione su grupo sanguíneo"}
          initialOptions={bloodTypes}
          required={true}
          selectId={"blood_type"}
          defaultValue={
            props.userData.blood_type === "N/A"
              ? null
              : props.userData.blood_type
          }
        />
        <div className="one-field-container">
          <label htmlFor="date_of_issue_document">
            Fecha de Expedición (Documento de Identidad):{" "}
          </label>
          <DateTime
            id="date_of_issue_document"
            inputProps={{
              placeholder: "aaaa-mm-dd",
              name: "date_of_issue_document",
              style: { fontFamily: "Work Sans"},
            }}
            initialValue={
              props.userData.date_of_issue_document || new Date().toISOString().slice(0, 10)
            }
            dateFormat="YYYY-MM-DD"
            timeFormat={false}
            required={true}
          />
        </div>
        
      </div>

      <div className="two-field-container">
        <LabelOneSelect
          labelText={"Género:"}
          selectText={"Seleccione su género"}
          initialOptions={genders}
          required={true}
          onChange={handleGenderChange}
          selectId={"gender"}
          defaultValue={
            props.userData.gender === "N/A"
              ? null
              : props.userData.gender === "male"
              ? "Masculino"
              : props.userData.gender === "female"
              ? "Femenino"
              : props.userData.gender === "other"
              ? "Otro"
              : selectedGender
          }
        />

        <LabelOneSelect
          labelText={"Raza: (opcional)"}
          selectText={"Seleccione su raza"}
          initialOptions={props.race}
          required={false}
          selectId={"race"}
          defaultValue={
            props.userData.race === "N/A" ? null : props.userData.race
          }
        />
      </div>

      <div className="two-field-container">
        <LabelOneSelect
          labelText={"Estado Civil: "}
          selectText={"Seleccione su estado civil"}
          initialOptions={maritalStatusOptions}
          required={true}
          selectId={"marital_status"}
          defaultValue={
            props.userData.marital_status === "N/A"
              ? null
              : props.userData.marital_status === "single"
              ? "Soltero(a)"
              : props.userData.marital_status === "married"
              ? "Casado (a)"
              : props.userData.marital_status === "cohabitant"
              ? "Cohabitante legal"
              : props.userData.marital_status === "widower"
              ? "Viudo(a)"
              : props.userData.marital_status === "divorced"
              ? "Divorciado"
              : null
          }
        />

        <LabelOneField
          labelText={"Escolaridad:"}
          inputId={"scholarship"}
          inputPlaceholder={"No Registrado"}
          inputType={"text"}
          disabled={true}
          defaultValue={
            props.userData.scholarship === "N/A"
              ? "Sin Registro"
              : props.userData.scholarship
          }
        />
      </div>

      <LabelOneSelect
        labelText={"Entidad Bancaria:"}
        selectText={"Seleccione Entidad Bancaria"}
        selectId={"bank_name"}
        initialOptions={props.banks}
        required={true}
        defaultValue={
          props.userData?.bank_name === "N/A" ? null : props.userData.bank_name
        }
      />

      <div className="two-field-container">
        <LabelOneSelect
          labelText={"Tipo de Cuenta:"}
          selectText={"Seleccione Su Tipo de Cuenta"}
          selectId={"bank_account_type"}
          initialOptions={bankAccountTypes}
          required={true}
          defaultValue={
            props.userData?.bank_account_type === "N/A"
              ? null
              : props.userData.bank_account_type
          }
        />

        <LabelOneField
          labelText={"No. Cuenta Bancaria:"}
          inputPlaceholder={"No. Cuenta"}
          inputId={"bank_account_number"}
          inputType={"text"}
          required={true}
          minLength={6}
          defaultValue={
            props.userData.bank_account_number === "N/A"
              ? null
              : props.userData.bank_account_number
          }
        />
      </div>
    </div>
  );
}

export default PersonalInformation;