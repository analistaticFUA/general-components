import React, { useState } from "react";
import LabelOneSelect from "../LabelOneSelect/LabelOneSelect";
import TagsSelector from "../TagsSelector/TagsSelector";
import "./Sociodemographic.css";

const Sociodemographics = (props) => {
  const [selectedGender, setSelectedGender] = useState("");
  const genders = ["Masculino", "Femenino", "Otro"];
  const hobbiesList = [
    "Fútbol",
    "Natación",
    "Caminar",
    "Baloncesto",
    "Ciclismo",
    "Lectura",
  ];
  const petsList = [
    "Perro",
    "Gato",
    "Aves Domésticas",
    "Peces",
    "Hámster",
    "Conejo",
    "Reptiles",
    "Tortuga",
    "Otro"
  ];

  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [selectedPets, setSelectedPets] = useState([]);
  const [customPet, setCustomPet] = useState(""); // Estado para la mascota personalizada
  const [hasPets, setHasPets] = useState("No"); // Control de la pregunta "¿Tienes mascotas?"

  const handleGenderChange = (value) => {
    setSelectedGender(value);
    if (props.onGenderChange) {
      props.onGenderChange(value);
    }
  };

  return (
    <div className="form-box">
      <h3>Información Sociodemográfica</h3>
      <div className="two-field-container">
        {/* Otros campos sociodemográficos */}
        <LabelOneSelect
          labelText={"Tipo de Vivienda:"}
          selectText={"Seleccione el tipo de vivienda"}
          selectId={"kind_house"}
          initialOptions={["Propia", "Arrendada", "Familiar"]}
          required={true}
          defaultValue={
            props.userData.housing_type === "N/A"
              ? null
              : props.userData.housing_type
          }
        />
        <LabelOneSelect
          labelText={"Zona:"}
          selectText={"Seleccione el tipo de zona"}
          selectId={"house_zone"}
          initialOptions={["Urbana", "Rural"]}
          required={true}
          defaultValue={
            props.userData.water_type === "N/A"
              ? null
              : props.userData.water_type
          }
        />
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
          labelText={"Raza:"}
          selectText={"Seleccione su raza"}
          initialOptions={props.race}
          required
          selectId={"race"}
          defaultValue={props.userData.race === "N/A" ? null : props.userData.race}
        />
      </div>

      <div className="user-tags one-field-container">
        <label htmlFor="">Hobbies/Deportes:</label>
        <TagsSelector
          tags={hobbiesList}
          onChange={(selected) => setSelectedHobbies(selected)}
        />
        <input type="hidden" name="hobbies" value={selectedHobbies} />
      </div>

      <LabelOneSelect
        labelText={"¿Tienes mascotas?"}
        selectText={"Selecciona"}
        initialOptions={["Si", "No"]}
        required={true}
        selectId={"havePets"}
        onChange={(value) => setHasPets(value)}
        defaultValue={hasPets}
      />

      {hasPets === "Si" && (
        <>
          <div className="user-tags one-field-container">
            <label htmlFor="">Mascotas:</label>
            <TagsSelector
              tags={petsList}
              onChange={(selected) => setSelectedPets(selected)}
            />
            <input type="hidden" name="pets" value={selectedPets.join(",")}/>
          </div>
          {/* Si se selecciona "Otro", mostrar un input para especificar */}
          {selectedPets.includes("Otro") && (
            <div className="one-field-container">
              <label htmlFor="customPet">Especifique otra mascota:</label>
              <input
                type="text"
                id="customPet"
                name="pet"
                value={customPet}
                onChange={(e) => setCustomPet(e.target.value)}
                placeholder="Ej: Conejo, Tortuga, etc."
              />
              
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Sociodemographics;
