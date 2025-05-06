import React, { useState, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosRequest from "../../hooks/useAxiosRequest";
import PersonalInformation from "../../components/PersonalInfo/PersonalInfo";
import HomeInformation from "../../components/HomeInfo/HomeInfo";
import SocialSecurity from "../../components/SocialSecurity/SocialSecurity";
import ExclusiveInitInfo from "../../components/ExclusiveInitInfo/ExclusiveInitInfo";
import EndowmentInformation from "../../components/Endowment/Endowment";
import EndowmentEmvariasForm from "../../components/EndowmentEmvarias/EndowmentEmvarias";
import EmergencyContact from "../../components/EmergencyContact/EmergencyContact";
import ChildrenInfo from "../../components/ChildrenInfo/ChildrenInfo";
import StudiesInfo from "../../components/StudiesInfo/StudiesInfo";
import UserContext from "../../context/UserContext";
import ListOptionsContext from "../../context/ListOptionsContext";
import LoadingComponent2 from "../../components/LoadingComponents/LoadingComponent2";
import Sociodemographics from "../../components/Sociodemographics/Sociodemographics";
import { MySwal } from "../../utils/alert";

function GeneralForm() {
  const aseoProject = "Programa de Gestión del Aseo de la Ciudad";
  const pantManSize = [];
  const pantWomanSize = [];
  const navigate = useNavigate();
  const {
    epsOptions,
    afpOptions,
    shoesSizes,
    pantsSizes,
    shirtSizes,
    severanceOptions,
    citiesCodes,
    countriesOptions,
    banksOptions,
    statesOptions,
    scholarshipOptions,
    maritalStatusOptions,
    racesOptions,
    relationshipOptions,
    academicLevels,
    academicStates,
    statesInfo,
  } = useContext(ListOptionsContext);

  const [selectedGender, setSelectedGender] = useState("");
  const [childrenData, setChildrenData] = useState([]);
  const [studiesData, setStudiesData] = useState([]);
  const [hobbiesData, setHobbiesData] = useState([]);
  const { userData } = useContext(UserContext);
  const [imageProfile, setImageProfile] = useState(null);
  const [sendingForm, setSendingForm] = useState(false);
  const { sendRequest } = useAxiosRequest();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const handleGenderChange = (gender) => {
    setSelectedGender(gender);
  };

  const handleImageChange = (imageData) => {
    setImageProfile(imageData);
  };

  const handleStudiesDataChange = (newStudiesData) => {
    setStudiesData(newStudiesData);
  };

  const handleHobbiesChange = (newHobbiesData)=> {
    setHobbiesData(newHobbiesData);
  };

  // Use useCallback to memorize this function
  const handleChildrenDataChange = useCallback((newChildrenData) => {
    setChildrenData(newChildrenData);
  }, []);

  if (!localStorage.getItem("token")) navigate("/login");

  pantsSizes.forEach((size) => {
    if (size >= 28) pantManSize.push(size.toString());
    else pantWomanSize.push(size.toString());
  });

  if (!userData) {
    return (
      <div className="principal-container">
        <LoadingComponent2 />
      </div>
    );
  }

  function formDataToJson(formData) {
    const object = {};
    formData.forEach((value, key) => {
      if (value === "" || value.trim() === "") {
        value = "N/A";
      }
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        if (Array.isArray(object[key])) {
          object[key].push(value);
        } else {
          object[key] = [object[key], value];
        }
      } else {
        object[key] = value;
      }
    });
    return object;
  }

  const sizeOptions =
    selectedGender === "Masculino"
      ? pantManSize
      : selectedGender === "Femenino"
      ? pantWomanSize
      : pantsSizes;

  // ACTUALIZAR FOTO DE PERFIL
  const updateProfilePicture = (data) => {
    const payload = { image_profile: data };

    return new Promise((resolve) => {
      sendRequest({
        url: `${backendUrl}/employees/image_profile/`,
        method: "POST",
        data: JSON.stringify(payload),
        headers,
        onSuccess: (response) => {
          console.log("Imagen Enviada Con Éxito:", response);
          resolve({ step: "Imagen de perfil", success: true });
        },
        onError: ({ message, status }) => {
          console.log("Error al cargar imagen:", { message, status });
          resolve({ step: "Imagen de perfil", success: false });
        },
      });
    });
  };

  // ACTUALIZAR DATOS EMPLEADO
  const updateEmployee = (formData) => {
    const payload = formDataToJson(formData);
    console.log("PAYLOAD /EMPLOYEES/: ", payload);
    return new Promise((resolve) => {
      sendRequest({
        url: `${backendUrl}/employees/`,
        method: "POST",
        data: payload,
        headers,
        onSuccess: (response) => {
          console.log("Datos Empleado Actualizados:", response);
          resolve({ step: "Datos generales", success: true });
        },
        onError: ({ message, status }) => {
          console.log("Error al cargar Datos Empleado:", { message, status });
          navigate("/general-form");
          resolve({ step: "Datos generales", success: false });
        },
      });
    });
  };

  // ACTUALIZAR DATOS HIJOS
  const updateChildren = (data) => {
    return new Promise((resolve) => {
      sendRequest({
        url: `${backendUrl}/employees/employee_sons/`,
        method: "POST",
        data,
        headers,
        onSuccess: (response) => {
          console.log("Datos Hijos Enviados:", response);
          resolve({ step: "Datos Hijos", success: true });
        },
        onError: ({ message, status }) => {
          console.log("Error al cargar Datos Hijos:", { message, status });
          resolve({ step: "Datos Hijos", success: false });
        },
      });
    });
  };

  // ACTUALIZAR DATOS ACADÉMICOS
  const updateStudies = (data) => {
    console.log('Studies Data to Send: ', data);
    return new Promise((resolve) => {
      sendRequest({
        url: `${backendUrl}/employees/academics/`,
        method: "POST",
        data,
        headers,
        onSuccess: (response) => {
          console.log("Datos Académicos Enviados:", response);
          resolve({ step: "Datos estudios", success: true });
        },
        onError: ({ message, status }) => {
          console.log("Error al cargar Datos Académicos:", { message, status });
          resolve({ step: "Datos estudios", success: false });
        },
      });
    });
  };

  //ACTUALIZAR HOBBIES
  const updateHobbies = (data) => {
    // data === array de hobbies seleccionados, e.g. ["Caminar","Fotografía"]
    const payload = data.reduce((acc, hobby) => {
      // clave: hobby en uppercase
      const key = hobby.toUpperCase();
      // valor.hobby: uppercase SIN acentos
      const hobbyValue = key
        .normalize("NFD") // descompone acentos
        .replace(/[\u0300-\u036f]/g, "") // los quita
      acc[key] = { hobby: hobbyValue };
      return acc;
    }, {});

    console.log('Payload HOBBIES: ', payload);

    return new Promise((resolve) => {
      sendRequest({
        url: `${backendUrl}/employees/hobbies/`,
        method: "POST",
        data: payload,
        headers,
        onSuccess: (response) => {
          console.log("Hobbies Enviados: ", response);
          resolve({ step: "Hobbies", success: true });
        },
        onError: ({ message, status }) => {
          console.log("Error al cargar Hobbies del empleado: ", {
            message,
            status,
          });
          resolve({ step: "Hobbies", success: false });
        },
      });
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;

    if (!form.checkValidity()) return;

    setSendingForm(true);
    const formData = new FormData(form);

    //Lista de promesas:
    const promises = [
      imageProfile
        ? updateProfilePicture(imageProfile)
        : Promise.resolve({ step: "Imagen de Perfil", success: true }),

      updateEmployee(formData),

      childrenData && childrenData.length > 0
        ? updateChildren(childrenData)
        : Promise.resolve({ step: "Datos Hijos", success: true }),

      hobbiesData && hobbiesData.length > 0
        ? updateHobbies(hobbiesData)
        : Promise.resolve({ step: "Hobbies", success: true}),

      studiesData &&
      typeof studiesData === "object" &&
      Object.keys(studiesData).length > 0
        ? updateStudies(studiesData)
        : Promise.resolve({ step: "Datos estudios", success: true }),
    ];

    Promise.all(promises).then((results) => {
      const failed = results.filter((r) => !r.success).map((r) => r.step);
      setSendingForm(false);

      if (failed.length === 0) {
        MySwal.fire({
          icon: "success",
          title: "¡Envío exitoso!",
          text: "Tus datos han sido actualizados correctamente.",
          confirmButtonText: "Continuar",
          confirmButtonColor: "#5c9c31",
        });
      } else {
        MySwal.fire({
          icon: "error",
          title: "¡Ha ocurrido un error!",
          html: `
            No se pudo completar:
            <strong>${failed.join("</strong>, <strong>")}</strong>.<br>
            Por favor verifica e intenta de nuevo.
          `,
          confirmButtonText: "Entendido",
          confirmButtonColor: "#fb4b4b",
        });
      }
    });
  };

  return (
    <div className="principal-container r">
      <h1 className="m-tp-85">Datos Generales</h1>

      <ExclusiveInitInfo
        nameBox={"Información Administrativa"}
        userData={userData}
      />
      <br />

      <form id="general-form" className="general-form" onSubmit={handleSubmit}>
        <PersonalInformation
          nameBox={"Información Personal"}
          onImageChange={handleImageChange}
          userData={userData}
          banks={banksOptions}
          countries={countriesOptions}
          statesData={statesInfo}
          cities={citiesCodes}
          states={statesOptions}
          scholarship={scholarshipOptions}
          maritalStatus={maritalStatusOptions}
        />

        <br />

        <Sociodemographics
          userData={userData}
          onGenderChange={handleGenderChange}
          race={racesOptions}
          onHobbiesDataChange={handleHobbiesChange}
        />

        <br />

        <StudiesInfo
          onStudiesDataChange={handleStudiesDataChange}
          academicStates={academicStates}
          academicLevels={academicLevels}
          project={userData?.employee_project}
          userId={userData?.id_document}
        />

        <br />
        <ChildrenInfo
          userData={userData}
          onChildrenDataChange={handleChildrenDataChange}
        />

        <br />

        <HomeInformation
          nameBox={"Información Domicilio"}
          userData={userData}
          homeCity={citiesCodes}
          statesData={statesInfo}
        />
        <br />

        <EmergencyContact
          userData={userData}
          relationship={relationshipOptions}
        />

        <br />
        <SocialSecurity
          nameBox={"Información Seguridad Social"}
          userData={userData}
          epsOptions={epsOptions}
          afpOptions={afpOptions}
          severanceOptions={severanceOptions}
        />
        <br />

        {userData?.employee_project === aseoProject ? (
          <EndowmentEmvariasForm
            nameBox={"Información Dotación"}
            userData={userData}
            pantSizes={pantsSizes}
            shirtSizes={shirtSizes}
            shoesSizes={shoesSizes}
          />
        ) : (
          <EndowmentInformation
            nameBox={"Información Dotación"}
            sizeOptions={sizeOptions}
            userData={userData}
            shoesSizes={shoesSizes}
            shirtSizes={shirtSizes}
          />
        )}
        <br />

        <button
          className="principal-button"
          type="submit"
          disabled={sendingForm}
        >
          {sendingForm ? (
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            <div>Enviar</div>
          )}
        </button>
      </form>
      <br />
    </div>
  );
}

export default GeneralForm;
