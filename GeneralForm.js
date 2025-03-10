import React, { useState, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosRequest from "../../hooks/useAxiosRequest";
import PersonalInformation from "../../components/PersonalInfo/PersonalInfo";
import HomeInformation from "../../components/HomeInfo/HomeInfo";
import SocialSecurity from "../../components/SocialSecurity/SocialSecurity";
import EndowmentInformation from "../../components/Endowment/Endowment";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import EmergencyContact from "../../components/EmergencyContact/EmergencyContact";
import ChildrenInfo from "../../components/ChildrenInfo/ChildrenInfo";
import StudiesInfo from "../../components/StudiesInfo/StudiesInfo";
import UserContext from "../../context/UserContext";
import ListOptionsContext from "../../context/ListOptionsContext";
import LoadingComponent2 from "../../components/LoadingComponents/LoadingComponent2";

function GeneralForm() {
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
  const { userData } = useContext(UserContext);
  const [imageProfile, setImageProfile] = useState(null);
  const [show, setShow] = useState(false); // Modal state
  const [showE, setShowE] = useState(false); // Modal state
  const [sendingForm, setSendingForm] = useState(false);
  const { sendRequest } = useAxiosRequest();
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleGenderChange = (gender) => {
    setSelectedGender(gender);
  };

  const handleImageChange = (imageData) => {
    setImageProfile(imageData);
  };

  const handleStudiesDataChange = (newStudiesData) => {
    setStudiesData(newStudiesData);
  };

  // Use useCallback to memorize this function
  const handleChildrenDataChange = useCallback((newChildrenData) => {
    setChildrenData(newChildrenData);
  }, []);

  const handleClose = () => setShow(false);
  const handleCloseE = () => setShowE(false);
  const handleShow = () => setShow(true);
  const handleShowE = () => setShowE(true);


  if (!localStorage.getItem("token")) navigate("/login");

  console.log('User Data: ', userData);

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


  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;

    let allSuccessful = true;

    if (form.checkValidity()) {
      setSendingForm(true);

      const formData = new FormData(form);

      console.log('HIJOS: ', childrenData);
      if (imageProfile) {
        const imageProfileData = { image_profile: imageProfile };
        await sendRequest({
          url: `${backendUrl}/employees/image_profile/`,
          method: "POST",
          data: JSON.stringify(imageProfileData),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }).catch((error) => {
          console.error("Error al actualizar foto", error);
          allSuccessful = false;
        });
      }

      const jsonData = formDataToJson(formData);

      await sendRequest({
        url: `${backendUrl}/employees/`,
        method: "POST",
        data: jsonData,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      }).catch((error) => {
        console.error("Error al actualizar datos del Empleado", error);
        allSuccessful = false;
        navigate("/general-form");
      });

      await sendRequest({
        url: `${backendUrl}/employees/employee_sons/`,
        method: "POST",
        data: childrenData,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).catch((error) => {
        console.error("Error al actualizar datos Hijos", error);
        allSuccessful = false;
        alert("Error en el envío de Infomación Hijos");
      });

      if (typeof studiesData === 'object' && studiesData !== null && Object.keys(studiesData).length > 0) {
        await sendRequest({
          url: `${backendUrl}/employees/academics/`,
          method: "POST",
          data: studiesData,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }).catch((error) => {
          console.error("Error al actualizar datos ACADÉMICOS", error);
          allSuccessful = false;
          alert("Error en el envío de Infomación ACADÉMICA");
        });
      }
    }

    if (allSuccessful) {
      handleShow();
      setSendingForm(false);
    } else {
      handleShowE();
      setSendingForm(false);
    }
  };

  return (
    <div className="principal-container r">
      <h1 className="m-tp-85">Datos Generales</h1>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Envío Exitoso</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Tus datos han sido actualizados correctamente.
        </Modal.Body>
        <Modal.Footer>
          <Button className="fua-btn-outline-1" type="button"  onClick={handleClose}>
            Regresar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showE} onHide={handleCloseE}>
        <Modal.Header closeButton>
          <Modal.Title>Ha ocurrido un error:</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tus datos no han sido enviados, por favor, inténtalo de nuevo o más tarde.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" type="button" onClick={handleCloseE}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <form id="general-form" className="general-form" onSubmit={handleSubmit}>
        <PersonalInformation
          nameBox={"Información Personal"}
          onGenderChange={handleGenderChange}
          onImageChange={handleImageChange}
          userData={userData}
          banks={banksOptions}
          countries={countriesOptions}
          statesData={statesInfo}
          cities={citiesCodes}
          states={statesOptions}
          scholarship={scholarshipOptions}
          race={racesOptions}
          maritalStatus={maritalStatusOptions}
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

        <EndowmentInformation
          nameBox={"Información Dotación"}
          sizeOptions={sizeOptions}
          userData={userData}
          shoesSizes={shoesSizes}
          shirtSizes={shirtSizes}
        />

        <br />

        <button className="principal-button" type="submit" disabled={sendingForm}>
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