// src/components/context/ListOptionsContext.js
import React, { createContext, useState, useEffect, useCallback } from "react";
import useAxiosRequest from "../hooks/useAxiosRequest";
import {
  extractNames,
  extractNamesAndCodes,
  extractStateNames,
  extractStatesInfo,
} from "../utils/extractNames";

const ListOptionsContext = createContext();

export const ListOptionsProvider = ({ children }) => {
  const [epsOptions, setEpsOptions] = useState([]);
  const [afpOptions, setAfpOptions] = useState([]);
  const [shoesSizes, setShoesSizes] = useState([]);
  const [pantsSizes, setPantsSizes] = useState([]);
  const [shirtSizes, setShirtSizes] = useState([]);
  const [severanceOptions, setSeveranceOptions] = useState([]);
  const [citiesCodes, setCitiesCodes] = useState([]);
  const [countriesOptions, setCountriesOptions] = useState([]);
  const [banksOptions, setBanksOptions] = useState([]);
  const [statesOptions, setStatesOptions] = useState([]);
  const [scholarshipOptions, setScholarshipOptions] = useState([]);
  const [maritalStatusOptions, setMaritalStatusOptions] = useState([]);
  const [racesOptions, setRacesOptions] = useState([]);
  const [relationshipOptions, setRelationshipOptions] = useState([]);
  const [academicLevels, setAcademicLevels] = useState([]);
  const [academicStates, setAcademicStates] = useState([]);
  const [statesInfo, setStatesInfo] = useState([]);
  const { sendRequest } = useAxiosRequest();
  const backendURL = process.env.REACT_APP_BACKEND_URL;

  const fetchListOptions = useCallback(() => {
    const token = localStorage.getItem('token');
    if (token){
        sendRequest({
            url: `${backendURL}/employees/list_options/`,
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            onSuccess: (data) => {
              setStatesInfo(extractStatesInfo(data));
              setEpsOptions(extractNames(data, "eps"));
              setAfpOptions(extractNames(data, "afp"));
              setSeveranceOptions(extractNames(data, "severance"));
              setCitiesCodes(extractNamesAndCodes(data, "cities"));
              setPantsSizes(extractNames(data, "pant_size").sort((a, b) => a - b));
              setShoesSizes(extractNames(data, "shoes_size"));
              setShirtSizes(extractNames(data, "shirt_size").sort((a, b) => a - b));
              setBanksOptions(extractNames(data, "banks"));
              setCountriesOptions(extractNames(data, "countries"));
              setScholarshipOptions(extractNames(data, "scholarship"));
              setMaritalStatusOptions(extractNamesAndCodes(data, "marital_status"));
              setRacesOptions(extractNames(data, "races"));
              setRelationshipOptions(extractNames(data, "relationship"));
              setAcademicLevels(extractNames(data, "academic_level"));
              setAcademicStates(extractNames(data, "academic_state"));
              setStatesOptions(extractStateNames(extractStatesInfo(data)));
              console.log(data);
            },
        });
    }
    
  }, [sendRequest, backendURL]);

  useEffect(() => {
    fetchListOptions();
  }, [fetchListOptions]);

  return (
    <ListOptionsContext.Provider
      value={{
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
      }}
    >
      {children}
    </ListOptionsContext.Provider>
  );
};

export default ListOptionsContext;
