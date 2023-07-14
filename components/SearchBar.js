import styles from "../styles/SearchBar.module.css";
import Input from "@mui/material/Input";
import { useState, useEffect } from "react";
import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function searchBar() {
  const [options, setOptions] = useState([]);
  const [departure, setDeparture] = useState(options[0]);
  const [departureCity, setDepartureCity] = useState('')

  const [arrivalOptions, setArrivalOptions] = useState([]);
  const [arrival, setArrival] = useState(options[0]);

  const [topDestinations, setTopDestinations] = useState([])

  //Au chargement de la page, les options de villes sont les 5 plus recherchées
  useEffect(() => {
    fetch(`https://api.comparatrip.eu/cities/popular/5`)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          let formattedOptions = data.map((opt, i) => {
            return { label: opt.local_name, id: opt.city_id, name: opt.unique_name };
          });
          setOptions([...formattedOptions]);
          setArrivalOptions([...formattedOptions]);
        }
      });
  }, []);

  //A partir de la ville de départ, top 5 des destinations 

  useEffect(() => {
    console.log("DEPARTURE IS", departure);
    console.log('DEPARTURECITY IS', departureCity)

    fetch(`https://api.comparatrip.eu/cities/popular/from/${departureCity}/5`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          let formattedTopDestinations = data.map((opt, i) => {
            return { label: opt.local_name, id: opt.city_id, name: opt.unique_name };
          });
          setTopDestinations([...formattedTopDestinations]);
        }
      });
  }, [departure]);

    useEffect(() => {
      console.log("OPTIONS ARE", options);
    }, [options]);

    useEffect(() => {
        console.log('TOP DESTINATIONS ARE', topDestinations)
      }, [topDestinations]);

  return (
    <div className={styles.container}>
      <Autocomplete
        value={departure}
        onChange={(event, newValue) => {
          setDeparture(newValue.label);
          setDepartureCity(newValue.name)
        }}
        disablePortal
        options={options}
        sx={{ width: 300 }}
        inputValue={departure}
        onInputChange={(event, newInputValue) => {
          fetch(
            `https://api.comparatrip.eu/cities/autocomplete/?q=${newInputValue}/`
          )
            .then((response) => response.json())
            .then((data) => {
              if (data) {
                let formattedOptions = data.map((opt, i) => {
                  return { label: opt.local_name, id: opt.city_id };
                });
                setOptions([...formattedOptions]);
              }
            });
        }}
        renderInput={(params) => (
          <TextField {...params} label="From : City, Station or Airport" />
        )}
      />

      <Autocomplete
        value={arrival}
        onChange={(event, newValue) => {
          setArrival(newValue.label);
        }}
        disablePortal
        options={arrivalOptions}
        sx={{ width: 300 }}
        inputValue={arrival}
        onInputChange={(event, newInputValue) => {
          fetch(
            `https://api.comparatrip.eu/cities/autocomplete/?q=${newInputValue}/`
          )
            .then((response) => response.json())
            .then((data) => {
              if (data) {
                let formattedOptions = data.map((opt, i) => {
                  return { label: opt.local_name, id: opt.city_id };
                });
                setArrivalOptions([...formattedOptions]);
              }
            });
        }}
        renderInput={(params) => (
          <TextField {...params} label="To : City, Station or Airport" />
        )}
      />
    </div>
  );
}
