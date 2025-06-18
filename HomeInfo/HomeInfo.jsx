import React, { useState, useEffect, useRef } from "react";
import LabelOneField from "../LabelOneField/LabelOneField";
import LabelTwoFields from "../LabelTwoFields/LabelTwoFields";
import LabelOneSelect from "../LabelOneSelect/LabelOneSelect";
import "../../assets/stylesheets/HomeInfo.css";

function HomeInfo(props) {
  
  //Variables Generales
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectMunicipality, setSelectedMunicipality] = useState("");
  const [municipalities, setMunicipalities] = useState([]);
  const [descriptionBox, setDescriptionBox] = useState("");
  const social_status = ['1','2','3', '4', '5', '6'];
  const isInitialized = useRef(false);

  //Variables para construir la 'Dirección de Residencia':
  const [wayType, setWayType] = useState("");
  const [wayName, setWayName] = useState("");
  const [homeId1, setHomeId1] = useState("");
  const [homeId2, setHomeId2] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [detail, setDetail] = useState("");

  // Estados para las direcciones concatenadas
  const [backendAddress, setBackendAddress] = useState("");
  const [displayAddress, setDisplayAddress] = useState("");

  /* FUNCIONES GENERALES */

  // Convertir a mayúsculas y eliminar caracteres especiales

  const sanitize = (str) => {
    if(!str) return "";
    return str.toUpperCase().replace(/[^A-Z0-9\s]/g, "").trim();
  }

  // Recalcular dirección cada que haya un cambio

  useEffect(()=>{
    const wt = sanitize(wayType);
    const wn = sanitize(wayName);
    const hid1 = sanitize(homeId1);
    const hid2 = sanitize(homeId2);
    const pt = sanitize(propertyType);
    const iden = sanitize(identifier);
    const dtl = sanitize(detail);
    let desc = sanitize(descriptionBox);

    if(pt === "CASA") desc = "";

    const display = `${wt} ${wn} # ${hid1} - ${hid2} (${pt} ${desc} ${iden} ${dtl})`;
    const backend = `${wt} ${wn}  ${hid1} ${hid2} ${pt} ${desc} ${iden} ${dtl}`;

    setDisplayAddress(display);
    setBackendAddress(backend);

  }, [wayType, wayName, homeId1, homeId2, propertyType, identifier, detail, descriptionBox]);

  // Delete the word 'Dirección' in home_adress value
  function ajustHomeAddress(data) {
    if (!data || typeof data !== "string") return "Dirección de Residencia";
    return data.replace(/dirección:\s*/i, "").trim();
  }

  // Obtener la dirección inicial del backend y establecerla como el valor por defecto en `displayAddress`
  useEffect(() => {
    if (props.userData.address_home_id && props.userData.address_home_id !== "N/A") {
      const cleanedAddress = ajustHomeAddress(props.userData.address_home_id);
      setDisplayAddress(cleanedAddress);
      setBackendAddress(props.userData.address_home_id);
    }
  }, [props.userData.address_home_id]);

  //STATES AND CITIES SETTINGS
  // Set initial department and municipalities based on home_city code
  useEffect(() => {
    if (!isInitialized.current && props.userData.home_city && props.statesData) {
      // Find the department based on the home_city code
      const department = Object.keys(props.statesData).find((dept) =>
        props.statesData[dept].some(
          (city) => city.code === props.userData.home_city
        )
      );

      if (department) {
        setSelectedDepartment(department);
        setMunicipalities(props.statesData[department]);
        setSelectedMunicipality(props.userData.home_city);
        isInitialized.current = true;
      }
    }
  }, [props.userData.home_city, props.statesData]);

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

  const municipalityOptions = municipalities.map((city) => ({
    label: city.name,
    value: city.code,
  }));

  return (
    <div className="form-box">
      <div className="card-name">
        <i className="fa-solid fa-house-chimney"></i>
        <h3>{props.nameBox}</h3>
      </div>
      
      <LabelOneField
        labelText={"Dirección de residencia:"}
        inputId={"address_home_id_display"}
        inputPlaceholder={"Dirección de residencia"}
        inputType={"text"}
        minLength={5}
        defaultValue={displayAddress}
        disabled
      />
      {/* Input hidden: enviará el valor correcto (backendAddress) en el POST */}
      <input type="hidden" name="address_home_id" value={backendAddress} />

      <div className="home-address-content">
        <div className="home-address-item">
          <label htmlFor="way-type">Tipo de Vía:</label>
          <select 
            id="way-type"
            defaultValue=""
            onChange={(e) => setWayType(e.target.value)}
          >
            <option value="" disabled>Elije una opción</option>
            <option value="CL">Calle</option>
            <option value="CR">Carrera</option>
            <option value="CQ">Circular</option>
            <option value="CV">Circunvalar</option>
            <option value="AV">Avenida</option>
            <option value="AC">Avenida Calle</option>
            <option value="AK">Avenida Carrera</option>
            <option value="AUT">Autopista</option>
            <option value="DG">Diagonal</option>
            <option value="KM">kilometro</option>
            <option value="TV">Transversal</option>
          </select>
        </div>

        <div className="home-address-item">
          <label htmlFor="way-name">Nombre/Nro. de Vía:</label>
          <input type="text" onChange={(e) => setWayName(e.target.value)} placeholder="Ej: 11 SUR"></input>
        </div>
        <div className="home-address-item">
          <label htmlFor="home-id-1">Nro. de Placa:</label>
          <div className="flex-address-item">
            <input type="text" onChange={(e) => setHomeId1(e.target.value)} placeholder="Ej: 55F"></input>
            <label htmlFor="home-id-2"> - </label>
            <input type="text" onChange={(e) => setHomeId2(e.target.value)} placeholder="Ej: 02"></input>
          </div>
        </div>

        <div className="home-address-item">
          <label htmlFor="property-type">Tipo de predio: </label>
          <div className="flex-address-item">
            <select 
              id="property-type" 
              onChange={(e) => setPropertyType(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>Elije una opción</option>
              <option value="CS">Casa</option>
              <option value="CD">Ciudadela</option>
              <option value="CO">Conjunto Residencial</option>
              <option value="ED">Edificio</option>
              <option value="UL">Unidad Residencial</option>
              <option value="UR">Urbanización</option>
            </select>

            {propertyType !== 'CS' && (
              <input type="text" id="description" placeholder="Ej: SANTA CLARA" onChange={(e) => setDescriptionBox(e.target.value)} />
            )}
          </div>
          
        </div>

        <div className="home-address-item">
          <label htmlFor="identifier">Identificador: </label>
          <div className="flex-address-item">
            <select 
              id="identifier" 
              defaultValue=""
              onChange={(e) => setIdentifier(e.target.value)}
            >
              <option value="" disabled>Elije una opción</option>
              <option value="AP">Apartamento</option>
              <option value="IN">Interior</option>
              <option value="PI">Piso</option>
            </select>
            <input 
              type="text" 
              onChange={(e) => setDetail(e.target.value)} 
              placeholder="Ej: 117 TORRE 2"
            />
          </div>
        </div>
      </div>
      
      <div className="two-field-container">
        <LabelOneSelect
          labelText={"Departamento de Residencia:"}
          selectText={"Seleccione su departamento de Residencia"}
          initialOptions={departmentOptions}
          onChange={handleDepartmentChange}
          required={true}
          defaultValue={selectedDepartment}
        />

        <LabelOneSelect
          labelText={"Municipio de Residencia:"}
          selectText={"Seleccione su Municipio"}
          selectId={"home_city"}
          initialOptions={municipalityOptions}
          onChange={handleMunicipalityChange}
          required={true}
          defaultValue={selectMunicipality}
        />
      </div>

      <div className="two-field-container">
        <LabelOneField 
          labelText={"Barrio:"}
          inputId={"home_neighborhood"}
          inputPlaceholder={"Nombre Barrio"}
          inputType={"text"}
          required={true}
          minLength={2}
          defaultValue={
            props.userData.home_neighborhood === "N/A" || null
              ? null
              : props.userData.home_neighborhood
          }
        />
         <LabelOneSelect
          labelText={"Estrato:"}
          selectText={"Seleccione su estrato"}
          selectId={"estrato"}
          initialOptions={social_status}
          required={true}
          defaultValue={
            props.userData.estrato === "N/A" || null
              ? null
              : props.userData.estrato
          }
        />
      </div>

      <LabelTwoFields
        labelText={"Teléfono:"}
        inputId={"telephone1"}
        inputPlaceholder={"Número de Teléfono"}
        inputType={"number"}
        minLength={6}
        defaultValue={
          props.userData.telephone1 === "N/A" || null
            ? null
            : props.userData.telephone1
        }
        labelText2={"Celular:"}
        inputId2={"cellphone"}
        inputPlaceholder2={"Número de Celular"}
        inputType2={"number"}
        required2={true}
        minLength2={10}
        maxLength2={12}
        defaultValue2={
          props.userData.cellphone === "N/A" || null
            ? "null"
            : props.userData.cellphone
        }
      />

      <LabelOneField
        labelText={"Correo Electrónico Personal:"}
        inputId={"email"}
        inputPlaceholder={"Correo Electrónico Personal"}
        inputType={"email"}
        required={true}
        defaultValue={
          props.userData.email === "N/A" || null ? null : props.userData.email
        }
      />
    </div>
  );
}

export default HomeInfo;
