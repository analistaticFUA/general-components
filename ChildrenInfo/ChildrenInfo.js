import React, { useState, useEffect, useCallback } from "react";
import moment from "moment";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import useAxiosRequest from "../../hooks/useAxiosRequest";

function ChildrenInfo(props) {
  const { onChildrenDataChange } = props; // Desestructuración de los props
  const { statusCode, sendRequest } = useAxiosRequest();
  const [childrenData, setChildrenData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tempIds, setTempIds] = useState({});
  const [childId, setChildId] = useState("");
  const [numberOfChildren, setNumberOfChildren] = useState(0);
  const [show, setShow] = useState(false);
  const genders = ["Masculino", "Femenino"];
  const [sendingForm, setSendingForm] = useState(false);
  const maxChildren = 12;
  const backendURL = process.env.REACT_APP_BACKEND_URL;

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const loadChildrenData = useCallback(() => {
    sendRequest({
      url: `${backendURL}/employees/employee_sons`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      onSuccess: (data) => {
        const initialChildrenData = Object.keys(data).map((id) => ({
          key: id,
          child_full_name: data[id].child_full_name || "",
          child_id_document: id,
          child_gender: data[id].child_gender || "",
          child_birth_date: data[id].child_birth_date || "",
          isNew: false,
        }));
        setChildrenData(initialChildrenData);
        setNumberOfChildren(initialChildrenData.length);
        setIsLoading(false);
      },
    });
  }, [sendRequest, backendURL]);

  useEffect(() => {
    loadChildrenData();
  }, [loadChildrenData]);

  const calculateAge = (birthDate) => {
    const today = moment();
    const birth = moment(birthDate, "YYYY-MM-DD");
    return today.diff(birth, "years");
  };

  const addNewChild = () => {
    if (numberOfChildren < maxChildren) {
      const newChild = {
        key: `temp-${numberOfChildren}-${Date.now()}`,
        child_full_name: "",
        child_id_document: "",
        child_gender: "",
        child_birth_date: "",
        isNew: true,
      };
      setChildrenData((prevChildrenData) => [...prevChildrenData, newChild]);
      setTempIds((prevTempIds) => ({ ...prevTempIds, [newChild.key]: "" }));
      setNumberOfChildren((prevNumber) => prevNumber + 1);
    }
  };

  const handleChildDataChange = (key, field, value) => {
    setChildrenData((prevChildrenData) =>
      prevChildrenData.map((child) =>
        child.key === key ? { ...child, [field]: value } : child
      )
    );
  };

  const handleChildIdChange = (key, value) => {
    setTempIds((prevTempIds) => ({
      ...prevTempIds,
      [key]: value,
    }));
  };

  const handleChildIdBlur = (key) => {
    setChildrenData((prevChildrenData) =>
      prevChildrenData.map((child) => {
        if (child.key === key && tempIds[key]) {
          return {
            ...child,
            child_id_document: tempIds[key],
            isNew: false,
          };
        }
        return child;
      })
    );
    setTempIds((prevTempIds) => {
      const updatedTempIds = { ...prevTempIds };
      delete updatedTempIds[key];
      return updatedTempIds;
    });
  };

  const prevDeleteChild = (key) => {
    handleShow();
    setChildId(key);
  };

  const deleteChild = (key) => {
    const childToDelete = childrenData.find((child) => child.key === key);
    if (!childToDelete) return;

    setSendingForm(true);
    sendRequest({
      url: `${backendURL}/employees/employee_sons/`,
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: {
        child_id_document: childToDelete.child_id_document,
      },
      onSuccess: (response) => {
        if (statusCode === 200) {
          setChildrenData((prevChildrenData) =>
            prevChildrenData.filter((child) => child.key !== key)
          );
          setNumberOfChildren((prevNumber) => prevNumber - 1);
          handleClose();
          setSendingForm(false);
        }
      },
      onError: (error) => {
        console.error("DELETE error:", error);
        setSendingForm(false);
      },
    });
  };

  useEffect(() => {
    // Usar JSON.stringify para evitar bucles infinitos
    const formattedChildrenData = childrenData.reduce((acc, child) => {
      const { key, ...childData } = child;
      acc[child.child_id_document] = childData;
      return acc;
    }, {});

    onChildrenDataChange(formattedChildrenData);
  }, [childrenData, onChildrenDataChange]);

  // if (isLoading) {
  //   return <LoadingComponent />;
  // }

  return (
    <div className="form-box">
      <h3>Información Hijos</h3>
      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          Antes de continuar, confirma que deseas eliminar esta información.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary btn-funda-red"
            onClick={() => deleteChild(childId)}
          >
            {sendingForm ? (
              <div className="spinner-border" role="status">
                <span
                  className="spinner-grow spinner-grow-sm"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden" role="status">
                  Loading...
                </span>
              </div>
            ) : (
              <div>Eliminar</div>
            )}
          </Button>
          <Button variant="secondary btn-funda" onClick={handleClose}>
            Conservar
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="one-field-container">
        <label htmlFor="numberOf_children">Número de Hijos:</label>
        <input
          id="numberOf_children"
          type="number"
          disabled
          readOnly
          value={numberOfChildren}
          placeholder="Número de Hijos"
        />
      </div>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {numberOfChildren > 0 && (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th scope="col">Nombre Completo</th>
                    <th scope="col">No. de Documento</th>
                    <th scope="col">Género</th>
                    <th scope="col">Fecha de Nacimiento</th>
                    <th scope="col">Edad</th>
                    <th scope="col">Eliminar</th>
                  </tr>
                </thead>
                <tbody>
                  {childrenData.map((child) => (
                    <tr key={child.key}>
                      <td className="child-name">
                        <input
                          type="text"
                          required={true}
                          value={child.child_full_name}
                          placeholder="Nombre Hijo(a)"
                          onChange={(e) =>
                            handleChildDataChange(
                              child.key,
                              "child_full_name",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className="child-id">
                        <input
                          id={`child_id_document_${child.key}`}
                          type="text"
                          required={true}
                          value={
                            child.isNew
                              ? tempIds[child.key] || ""
                              : child.child_id_document
                          }
                          placeholder="Número de Documento"
                          disabled={!child.isNew}
                          onChange={(e) =>
                            handleChildIdChange(child.key, e.target.value)
                          }
                          onBlur={() => handleChildIdBlur(child.key)}
                        />
                      </td>
                      <td className="child-gender">
                        <select
                          value={child.child_gender}
                          onChange={(e) =>
                            handleChildDataChange(
                              child.key,
                              "child_gender",
                              e.target.value
                            )
                          }
                        >
                          <option value="" disabled>
                            {"Seleccione el género de su hijo(a)"}
                          </option>
                          {genders.map((gender, i) => (
                            <option key={i} value={gender}>
                              {gender}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="child-birth">
                        <input
                          type="date"
                          required={true}
                          value={child.child_birth_date}
                          onChange={(e) =>
                            handleChildDataChange(
                              child.key,
                              "child_birth_date",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className="child-age">
                        <input
                          type="number"
                          disabled={true}
                          value={calculateAge(child.child_birth_date)}
                          readOnly
                        />
                      </td>
                      <td className="d-flex justify-content-center align-items-center">
                        <button
                          className="trash-button"
                          type="button"
                          onClick={() => prevDeleteChild(child.key)}
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
          )}
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ margin: "15px 0" }}
          >
            <button
              className="btn btn-primary fua-btn-outline-1"
              type="button"
              onClick={addNewChild}
              disabled={numberOfChildren >= maxChildren}
            >
              Agregar Hijo(a)
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ChildrenInfo;
