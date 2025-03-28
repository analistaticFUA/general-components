import React, { useState, useEffect, useCallback, useRef } from "react";
import SimpleSelect from "../SimpleSelect/SimpleSelect";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import useAxiosRequest from "../../hooks/useAxiosRequest";
import ComboBox from "../ComboBox/ComboBox";
import UploadFile from "../Uploads/UploadFile";

function StudiesInfo({ 
  onStudiesDataChange, 
  academicLevels, 
  academicStates, 
  project,
  userId,
}) 
{
  const metro = "Programa de Conducción de Vehículos de Transporte Masivo";
  const { statusCode, sendRequest } = useAxiosRequest();
  const [studiesData, setStudiesData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [studiesId, setStudiesId] = useState("");
  const [sendingForm, setSendingForm] = useState(false);
  const [show, setShow] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [newStudy, setNewStudy] = useState({
    academic_level: "",
    university: "",
    program: "",
    academic_state: "",
    total_credits: "",
    approved_credits: "",
    semester:"",
    graduation_year: "",
    department: "",
    municipality: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [fieldValidity, setFieldValidity] = useState({
    academic_level: false,
    university: false,
    program: false,
    academic_state: false,
    graduation_year: false,
    department: false,
    municipality: false,
  });

  // const departments = [
  //   "CESAR",
  //   "SANTANDER",
  //   "CHOCÓ",
  //   "BOGOTÁ, D.C.",
  //   "ANTIOQUIA",
  //   "VALLE DEL CAUCA",
  //   "CUNDINAMARCA",
  //   "NARIÑO",
  //   "BOYACÁ",
  //   "HUILA",
  //   "RISARALDA",
  //   "BOLÍVAR",
  //   "ATLÁNTICO",
  //   "MAGDALENA",
  //   "QUINDIO",
  //   "CALDAS",
  //   "LA GUAJIRA",
  //   "PUTUMAYO",
  //   "CÓRDOBA",
  //   "META",
  //   "NORTE DE SANTANDER",
  //   "SUCRE",
  //   "CAUCA",
  //   "TOLIMA",
  //   "VICHADA",
  //   "CASANARE",
  //   "GUAVIARE",
  //   "ARAUCA",
  //   "CAQUETÁ",
  //   "ARCHIPIÉLAGO DE SAN ANDRÉS, PROVIDENCIA Y SANTA CATALINA",
  //   "AMAZONAS",
  //   "GUAINÍA",
  //   "VAUPÉS",
  // ];

  const initialLoad = useRef(true);
  const [universitiesByRow, setUniversitiesByRow] = useState({});
  const [programsByUniversity, setProgramsByUniversity] = useState({});
  // const [municipalities, setMunicipalities] = useState([]);
  const universitiesURL = process.env.REACT_APP_UNIVERSITIES_URL;
  const backendURL = process.env.REACT_APP_BACKEND_URL;
  const schoolsUrl = process.env.REACT_APP_SCHOOLS_URL;

  const handleClose = () => {
    setUniversitiesByRow({});
    setProgramsByUniversity({});
    setShow(false);
  };
  const handleShow = () => {
    setNewStudy({
      academic_level: "",
      university: "",
      program: "",
      academic_state: "",
      total_credits: "",
      approved_credits: "",
      semester:"",
      graduation_year: "",
      department: "",
      municipality: "",
    });
    setUniversitiesByRow({});
    setProgramsByUniversity({});
    setIsCustom(false);
    setShow(true);
  };

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;

      sendRequest({
        url: `${backendURL}/employees/academics/`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        onSuccess: (data) => {
          if (typeof data === "object" && data !== null) {
            const initialStudiesData = Object.keys(data).reduce((acc, key) => {
              const item = data[key];
              const newId = `${item.academic_level}-${item.program}`;
              acc[newId] = {
                ...item,
                isNew: false,
              };
              return acc;
            }, {});
            setStudiesData(initialStudiesData);
            setIsLoading(false);
          } else {
            console.error("Expected an object but received:", data);
          }
        },
        onError: (error) => {
          console.error("Error fetching academic data:", error);
          if (!error.response) {
            alert(
              "Network error. Please check your internet connection and try again."
            );
          }
        },
      });
    }
  }, [backendURL, sendRequest]);

  const fetchAndStoreData = (level, rowId, department = "") => {
    if (["Primaria", "Secundaria", "Media"].includes(level)) {
      return;
      // const urlDeparmentList = `https://www.datos.gov.co/resource/ea56-rtcx.json?$query=SELECT%20%60nombremunicipio%60%20WHERE%20caseless_contains(%60nombredepartamento%60%2C%20%22${department}%22)%20ORDER%20BY%20%60genero%60%20DESC%20NULL%20FIRST%20LIMIT%202200%20OFFSET%200`;
      // sendRequest({
      //   url: urlDeparmentList,
      //   method: "GET",
      //   headers: { "Content-Type": "application/json" },
      //   onSuccess: (data) => {
      //     const municipalityList = data.map((item) => item.nombremunicipio);
      //     const uniqueMunicipalities = [...new Set(municipalityList)];
      //     const sortedMunicipalities = uniqueMunicipalities.sort((a, b) =>
      //       a.localeCompare(b)
      //     );
      //     setMunicipalities(sortedMunicipalities);
      //   },
      // });
    } else {
      //Consulta a la API por nivel de Formación (Universidades)
      let urlInst = `nombrenivelformacion=${level}&$limit=10000`;
      if (level.startsWith("Especial")) {
        urlInst =
          "$query=SELECT%0A%20%20%60nombreinstitucion%60%2C%0A%20%20%60nombretituloobtenido%60%0AWHERE%20starts_with(%60nombrenivelformacion%60%2C%20%22Especializaci%C3%B3n%22)%0AORDER%20BY%20%60%3Aid%60%20ASC%20NULL%20LAST%0ALIMIT%209000%0AOFFSET%200&";
      }

      sendRequest({
        url: `${universitiesURL}${urlInst}`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        onSuccess: (data) => {
          const institutionsList = data.map((item) => item.nombreinstitucion);
          const uniqueInstitutions = [...new Set(institutionsList)];
          const sortedInstitutions = uniqueInstitutions.sort((a, b) =>
            a.localeCompare(b)
          );
          setUniversitiesByRow((prev) => ({
            ...prev,
            [rowId]: sortedInstitutions,
          }));

          const programsByUni = data.reduce((acc, item) => {
            const uni = item.nombreinstitucion;
            if (!acc[uni]) {
              acc[uni] = [];
            }
            const uniquePrograms = [
              ...new Set(acc[uni].concat(item.nombretituloobtenido)),
            ];
            const sortedPrograms = uniquePrograms.sort((a, b) =>
              a.localeCompare(b)
            );
            acc[uni] = sortedPrograms;
            return acc;
          }, {});

          setProgramsByUniversity((prev) => ({
            ...prev,
            [rowId]: programsByUni,
          }));
        },
      });
    }
  };

  const handleNewStudyChange = (field, value) => {
    // Actualizar el estado de 'newStudy' con el nuevo valor proporcionado para el campo específico.
    setNewStudy((prevStudy) => ({
      ...prevStudy,
      [field]: value, // Actualizar el campo específico que ha cambiado
    }));

    // Determinamos si el nuevo valor es válido (no vacío y no nulo).
    let isValid = value.trim() !== ""; // Validación general para no estar vacío

    const newFieldValidity = { ...fieldValidity, [field]: isValid }; // Actualizamos la validez del campo específico

    // Si el campo cambiado es 'academic_state', ajustamos la validez de 'graduation_year'
    if (field === "academic_state") {
      if (value === "Terminado") {
        newFieldValidity.graduation_year =
          newStudy.graduation_year.trim() !== ""; // Validar que no esté vacío.
      } else {
        newFieldValidity.graduation_year = true; // Si no es 'Terminado', el campo 'graduation_year' no es obligatorio.
      }
    }

    // Si el campo cambiado es 'academic_level', ajustamos otros campos y cargamos datos relacionados.
    if (field === "academic_level") {
      if (["Primaria", "Secundaria", "Media"].includes(value)) {
        // newFieldValidity.department = false; // Se requieren 'department' y 'municipality' para estos niveles.
        // newFieldValidity.municipality = false;
        // fetchAndStoreData(value, "new"); // Llamamos a la función para cargar datos relacionados.
      } else {
        // Si no es Primaria, Secundaria o Media, no se requiere 'department' ni 'municipality'.
        newFieldValidity.department = true;
        newFieldValidity.municipality = true;
        fetchAndStoreData(value, "new");
      }

      if (
        [
          "Formación técnica profesional",
          "Tecnológica",
          "Primaria",
          "Secundaria",
          "Media",
        ].includes(value)
      ) {
        setIsCustom(true);
      } else {
        setIsCustom(false);
      }

      // Restablecer 'university' y 'program' cuando se cambia 'academic_level'.
      setNewStudy((prevStudy) => ({
        ...prevStudy,
        university: "",
        program: "",
      }));
    } else if (field === "department") {
      // Si el campo cambiado es 'department', cargamos los municipios correspondientes
      fetchAndStoreData(newStudy.academic_level, "new", value);
      setNewStudy((prevStudy) => ({ ...prevStudy, municipality: "" }));
    } else if (field === "municipality") {
      // Llamamos a la API para obtener instituciones por municipio
      const urlInstitucionesPorMunicipio = `${schoolsUrl}?nombremunicipio=${value}`;
      sendRequest({
        url: urlInstitucionesPorMunicipio,
        method: "GET",
        headers: { "Content-Type": "application/json" },
        onSuccess: (data) => {
          const institutionsList = data.map(
            (item) => item.nombreestablecimiento
          );
          const uniqueInstitutions = [...new Set(institutionsList)];
          const sortedInstitutions = uniqueInstitutions.sort((a, b) =>
            a.localeCompare(b)
          );
          setUniversitiesByRow((prev) => ({
            ...prev,
            new: sortedInstitutions,
          }));
        },
      });
    }

    // Validaciones para niveles académicos que permiten entradas personalizadas
    if (
      field === "university" &&
      [
        "Formación técnica profesional",
        "Tecnológica",
        "Primaria",
        "Secundaria",
        "Media",
      ].includes(newStudy.academic_level)
    ) {
      // Permitir universidades personalizadas para estos niveles
      value = value.toUpperCase();
      newFieldValidity.university = value.trim().length > 0;
    } else if (
      field === "program" &&
      [
        "Formación técnica profesional",
        "Tecnológica",
        "Primaria",
        "Secundaria",
        "Media",
      ].includes(newStudy.academic_level)
    ) {
      // Permitir programas personalizados para estos niveles
      value = value.toUpperCase();
      newFieldValidity.program = value.trim().length > 0;
    } else if (field === "university") {
      // Si se cambia 'university', reiniciar el valor de 'program'
      setNewStudy((prevStudy) => ({ ...prevStudy, program: "" }));
    }

    // Actualizar el estado 'fieldValidity' con la nueva validez del campo
    setFieldValidity(newFieldValidity);
  };

  // Utilizamos useCallback para memoizar la función validateForm
  const validateForm = useCallback(() => {
    let allValid = true;

    // Verificar que cada campo de newStudy esté completo (según lo que se requiere)
    if (!newStudy.academic_level || !newStudy.academic_state) {
      allValid = false;
    }

    // Si el estado académico es 'Terminado', la 'graduation_year' es obligatoria.
    if (
      newStudy.academic_state === "Terminado" &&
      !newStudy.graduation_year.trim()
    ) {
      allValid = false;
    }

    // Validación especial para 'Formación técnica profesional' o 'Tecnológica'
    if (
      [
        "Formación técnica profesional",
        "Tecnológica",
        "Primaria",
        "Secundaria",
        "Media",
      ].includes(newStudy.academic_level)
    ) {
      if (!newStudy.university.trim()) {
        allValid = false;
      }
      if (!newStudy.program.trim()) {
        allValid = false;
      }
    } else {
      // Para otros niveles, verificar que university y program estén en fieldValidity
      if (!fieldValidity.university || !fieldValidity.program) {
        allValid = false;
      }
    }
    setIsFormValid(allValid);
  }, [newStudy, fieldValidity]);

  // Reducimos las dependencias a solo las necesarias
  useEffect(() => {
    validateForm();
  }, [newStudy, fieldValidity, validateForm]);

  const handleAddNewStudy = () => {
    const newId =
      `${newStudy.academic_level}-${newStudy.program}`.toUpperCase();

    const updatedStudiesData = {
      ...studiesData,
      [newId]: {
        ...newStudy,
        isNew: true,
      },

    };

    setStudiesData(updatedStudiesData); // Actualiza el estado local

    onStudiesDataChange(updatedStudiesData); // Actualiza el estado en GeneralForm
    console.log('ESTUDIOS:', updatedStudiesData);

    // Reiniciar el formulario para un nuevo estudio
    setNewStudy({
      academic_level: "",
      university: "",
      program: "",
      academic_state: "",
      total_credits: "",
      approved_credits: "",
      semester:"",
      graduation_year: "",
      department: "",
      municipality: "",
    });
    setShow(false);
  };

  const handleShowDeleteModal = (id) => {
    handleShow();
    setStudiesId(id);
  };

  const deleteStudies = (id) => {
    const study = studiesData[id];
    setSendingForm(true);
    sendRequest({
      url: `${backendURL}/employees/academics/`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: {
        program: study.program,
        academic_level: study.academic_level,
      },
      onSuccess: (response) => {
        if (statusCode === 200) {
          setStudiesData((prevStudiesData) => {
            const updatedStudiesData = { ...prevStudiesData };
            delete updatedStudiesData[id];
            onStudiesDataChange(updatedStudiesData);
            return updatedStudiesData;
          });
          handleClose();
          setSendingForm(false);
        }
      },
      onError: (error) => {
        if (!error.response) {
          alert(
            "Network error. Please check your internet connection and try again."
          );
        }
      },
    });
  };

  return (
    <div className="form-box">
      <h3>Información Académica</h3>

      <UploadFile 
        requiredFile={"Certificado Horario de Estudios:"}
        descriptionFile={"Semestre Actual."}
        userId={userId}
        devNameFile={"CERTIFICADO HORARIO"}
      />

      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          Antes de continuar, confirma que deseas eliminar esta información.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary btn-funda-red"
            type="button"
            onClick={() => deleteStudies(studiesId)}
          >
            {sendingForm ? (
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <div>Eliminar</div>
            )}
          </Button>
          <Button variant="secondary btn-funda" type="button" onClick={handleClose}>
            Conservar
          </Button>
        </Modal.Footer>
      </Modal>

      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasRightLabel">
            Añadir datos académicos
          </h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          {isCustom && (
            <div className="alert alert-info" role="alert">
              En caso de{" "}
              <strong>No encontrar su Institución o Programa académico</strong>{" "}
              en la lista ofrecida, puede ingresarlo manualmente
            </div>
          )}

          <div className="form-group mt-3">
            <label htmlFor="academic-level-new">Nivel Académico</label>
            <SimpleSelect
              selectId="academic-level-new"
              selectedOption={newStudy.academic_level}
              selectText={"Seleccione su nivel académico"}
              initialOptions={academicLevels}
              defaultValue={newStudy.academic_level}
              required={false}
              onChange={(e) =>
                handleNewStudyChange("academic_level", e.target.value)
              }
            />

            <div className="offcanvas-separator"></div>
            {/* {(newStudy.academic_level === "Primaria" ||
              newStudy.academic_level === "Secundaria" ||
              newStudy.academic_level === "Media") && (
              <>
                <label className="mt-3" htmlFor="department-new">Departamento</label>
                <ComboBox
                  selectId="department-new"
                  selectedOption={newStudy.department}
                  selectText={"Seleccione su departamento"}
                  required={false}
                  initialOptions={departments}
                  defaultValue={newStudy.department}
                  onChange={(e) =>
                    handleNewStudyChange("department", e.target.value)
                  }
                />

                <label className="mt-3" htmlFor="municipality-new">Municipio</label>
                <ComboBox
                  selectId="municipality-new"
                  selectedOption={newStudy.municipality}
                  selectText={"Seleccione su municipio"}
                  required={false}
                  initialOptions={municipalities}
                  defaultValue={newStudy.municipality}
                  onChange={(e) =>
                    handleNewStudyChange("municipality", e.target.value)
                  }
                />
              </>
            )} */}
          </div>
          <div className="form-group mt-3">
            <label htmlFor="university-new">Institución</label>
            <ComboBox
              selectId="university-new"
              selectedOption={newStudy.university}
              selectText={"Seleccione su entidad educativa"}
              required={false}
              initialOptions={universitiesByRow["new"] || []}
              defaultValue={newStudy.university}
              onChange={(e) =>
                handleNewStudyChange("university", e.target.value)
              }
              allowCustom={[
                "Formación técnica profesional",
                "Tecnológica",
                "Primaria",
                "Secundaria",
                "Media",
              ].includes(newStudy.academic_level)}
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="academic-program-new">Programa Académico</label>
            <ComboBox
              selectId="academic-program-new"
              selectedOption={newStudy.program}
              selectText={"Seleccione su programa académico"}
              initialOptions={
                ["Primaria", "Secundaria", "Media"].includes(
                  newStudy.academic_level
                )
                  ? ["BÁSICA PRIMARIA", "BACHILLER"]
                  : programsByUniversity["new"]?.[newStudy.university] || []
              }
              required={false}
              defaultValue={newStudy.program}
              onChange={(e) => handleNewStudyChange("program", e.target.value)}
              allowCustom={[
                "Formación técnica profesional",
                "Tecnológica",
                "Primaria",
                "Secundaria",
                "Media",
              ].includes(newStudy.academic_level)}
            />
          </div>

          <div className="form-group mt-3">
            <label htmlFor="academic-state-new">Estado</label>
            <SimpleSelect
              selectId="academic-state-new"
              selectedOption={newStudy.academic_state}
              selectText={"Seleccione el estado"}
              initialOptions={academicStates}
              defaultValue={newStudy.academic_state}
              required={false}
              onChange={(e) =>
                handleNewStudyChange("academic_state", e.target.value)
              }
            />
          </div>

         {newStudy.academic_state==="En Proceso" && project===metro && (
          <>
            <div className="form-group mt-3">
              <label htmlFor="total-credits-new">Total Créditos del Programa:</label>
              <input
                type="number"
                id="total-credits-new"
                placeholder="Ej: 180"
                value={newStudy.total_credits}
                required={newStudy.academic_state === "En Proceso"}
                onInput={(e) => {
                  handleNewStudyChange("total_credits", e.target.value);
                }}
              />
            </div>

            <div className="form-group mt-3">
              <label htmlFor="approved-credits-new">Créditos Aprobados a la Fecha:</label>
              <input
                type="number"
                id="approved-credits-new"
                placeholder="Ej: 117"
                value={newStudy.approved_credits}
                required={newStudy.academic_state === "En Proceso"}
                onInput={(e) => {
                  handleNewStudyChange("approved_credits", e.target.value);
                }}
              />
            </div>
            
            <div className="form-group mt-3">
              <label htmlFor="semester-new">Semestre:</label>
              <input
                type="number"
                id="semester-new"
                placeholder="Ej: 7"
                value={newStudy.semester}
                required={newStudy.academic_state === "En Proceso"}
                onInput={(e) => {
                  handleNewStudyChange("semester", e.target.value);
                }}
              />
            </div>
          </>
          
         )}

          <div className="form-group mt-3">
            <label htmlFor="graduation-year-new">Año de Graduación</label>
            <input
              type="number"
              id="graduation-year-new"
              placeholder="Año de graduación"
              value={newStudy.graduation_year}
              min={"1950"}
              max={new Date().getFullYear()}
              required={newStudy.academic_state === "Terminado"} // Required only when "Terminado"
              onInput={(e) => {
                // Limitar el número de dígitos a 4
                const inputValue = e.target.value.slice(0, 4);
                handleNewStudyChange("graduation_year", inputValue);
              }}
              disabled={newStudy.academic_state !== "Terminado"}
            />
          </div>
          <div className="d-flex justify-content-center mt-4">
            <Button
              type="button"
              variant="primary"
              className="btn-funda"
              onClick={handleAddNewStudy}
              disabled={!isFormValid}
            >
              Añadir
            </Button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">Nivel</th>
                  <th scope="col">Institución</th>
                  <th scope="col">Formación Académica</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Año de Graduación</th>
                  <th scope="col">Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(studiesData).map((id) => (
                  <tr key={id}>
                    <td className="academic-level">
                      {studiesData[id].academic_level}
                    </td>
                    <td className="academic-entity">
                      {studiesData[id].university}
                    </td>
                    <td className="academic-program">
                      {studiesData[id].program}
                    </td>
                    <td className="academic-state">
                      {studiesData[id].academic_state}
                    </td>
                    <td className="academic-year">
                      {studiesData[id].graduation_year}
                    </td>
                    <td className="td-center">
                      <button
                        className="trash-button"
                        type="button"
                        onClick={() => handleShowDeleteModal(id)}
                      >
                        <i
                          className="fa-regular fa-trash-can fa-lg trash-icon-settings"
                          style={{ color: "#e32228" }}
                        ></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ margin: "15px 0" }}
          >
            <button
              className="btn btn-primary fua-btn-outline-1"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasRight"
              aria-controls="offcanvasRight"
            >
              Agregar Estudio
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default StudiesInfo;
