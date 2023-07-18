import styles from "../styles/SearchBar.module.css";
import { useState, useEffect } from "react";
import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import Switch from "@mui/material/Switch";
import { lightGreen } from "@mui/material/colors";
import { alpha, styled } from "@mui/material/styles";

import Button from "@mui/material/Button";

export default function searchBar() {
  const [options, setOptions] = useState([]);
  const [departure, setDeparture] = useState(options[0]);
  const [departureCity, setDepartureCity] = useState("");

  const [arrivalOptions, setArrivalOptions] = useState([]);
  const [arrival, setArrival] = useState(options[0]);

  const [topDestinations, setTopDestinations] = useState([]);

  //Permettre de sélectionner Aller simple ou A/R
  const [oneOrRound, setOneOrRound] = useState("One-way");

  const [selectedDepartureDate, setSelectedDepartureDate] = useState(null);
  const [selectedArrivalDate, setSelectedArrivalDate] = useState(null);

  // Compteur billets adulte/jeune/senior
  const [adultCount, setAdultCount] = useState(1);
  const [youthCount, setYouthCount] = useState(0);
  const [seniorCount, setSeniorCount] = useState(0);

  const handleChange = (event) => {
    setOneOrRound(event.target.value);
  };

  useEffect(() => {
    console.log("SELECTED DEPARTURE DATE IS", selectedDepartureDate);
  }, [selectedDepartureDate]);

  //Au chargement de la page, les options de villes sont les 5 plus recherchées
  useEffect(() => {
    fetch(`https://api.comparatrip.eu/cities/popular/5`)
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          let formattedOptions = data.map((opt, i) => {
            return {
              label: opt.local_name,
              id: opt.city_id,
              name: opt.unique_name,
            };
          });
          setOptions([...formattedOptions]);
          setArrivalOptions([...formattedOptions]);
        }
      });
  }, []);

  //A partir de la ville de départ, top 5 des destinations

  useEffect(() => {
    console.log("DEPARTURE IS", departure);
    console.log("DEPARTURECITY IS", departureCity);

    fetch(`https://api.comparatrip.eu/cities/popular/from/${departureCity}/5`)
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          let formattedTopDestinations = data.map((opt, i) => {
            return {
              label: opt.local_name,
              id: opt.city_id,
              name: opt.unique_name,
            };
          });
          setTopDestinations([...formattedTopDestinations]);
        }
      });
  }, [departure]);

  useEffect(() => {
    console.log("OPTIONS ARE", options);
  }, [options]);

  useEffect(() => {
    console.log("TOP DESTINATIONS ARE", topDestinations);
  }, [topDestinations]);

  //Switch component
  const GreenSwitch = styled(Switch)(({ theme }) => ({
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: lightGreen[600],
      "&:hover": {
        backgroundColor: alpha(
          lightGreen[600],
          theme.palette.action.hoverOpacity
        ),
      },
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: lightGreen[600],
    },
  }));

  const label = { inputProps: { "aria-label": "Color switch demo" } };

  return (
    <div className={styles.container}>
      <div className={styles.selectContainer}>
        <FormControl
          variant="standard"
          sx={{ m: 1, minWidth: 120 }}
          size="small"
        >
          <Select value={oneOrRound} onChange={handleChange}>
            <MenuItem value={"One-way"}>One-way</MenuItem>
            <MenuItem value={"Round trip"}>Round trip</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
          <Select className={styles.count} value={"test"}>
            {/* Compteur de places cat.adulte */}
            <MenuItem value={adultCount} className={styles.counterContainer}>
              <div className={styles.categoryContainer}>
                <p className={styles.categoryTicket}>Adult</p>
                <p className={styles.ageTicket}>26+ years</p>
              </div>
              <div className={styles.buttonsContainer}>
                <button
                  className={styles.countBtn}
                  id="decrementBtn"
                  onClick={() =>
                    adultCount > 0
                      ? setAdultCount(adultCount - 1)
                      : setAdultCount(adultCount)
                  }
                >
                  -
                </button>
                <span className={styles.counter} id="counter">
                  {adultCount}
                </span>
                <button
                  className={styles.countBtn}
                  id="incrementBtn"
                  onClick={() => setAdultCount(adultCount + 1)}
                >
                  +
                </button>
              </div>
            </MenuItem>
            {/* Compteur de places cat.jeune */}
            <MenuItem value={youthCount} className={styles.counterContainer}>
              <div className={styles.categoryContainer}>
                <p className={styles.categoryTicket}>Youth</p>
                <p className={styles.ageTicket}>0-25 years</p>
              </div>
              <div className={styles.buttonsContainer}>
                <button
                  className={styles.countBtn}
                  id="decrementBtn"
                  onClick={() =>
                    youthCount > 0
                      ? setYouthCount(youthCount - 1)
                      : setYouthCount(youthCount)
                  }
                >
                  -
                </button>
                <span className={styles.counter} id="counter">
                  {youthCount}
                </span>
                <button
                  className={styles.countBtn}
                  id="incrementBtn"
                  onClick={() => setYouthCount(youthCount + 1)}
                >
                  +
                </button>
              </div>
            </MenuItem>

            {/* Compteur de places cat.senior */}
            <MenuItem value={seniorCount} className={styles.counterContainer}>
              <div className={styles.categoryContainer}>
                <p className={styles.categoryTicket}>Senior</p>
                <p className={styles.ageTicket}>58+ years</p>
              </div>
              <div className={styles.buttonsContainer}>
                <button
                  className={styles.countBtn}
                  id="decrementBtn"
                  onClick={() =>
                    seniorCount > 0
                      ? setSeniorCount(seniorCount - 1)
                      : setSeniorCount(seniorCount)
                  }
                >
                  -
                </button>
                <span className={styles.counter} id="counter">
                  {seniorCount}
                </span>
                <button
                  className={styles.countBtn}
                  id="incrementBtn"
                  onClick={() => setSeniorCount(seniorCount + 1)}
                >
                  +
                </button>
              </div>
            </MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className={styles.autocompleteContainer}>
        <Autocomplete
          value={departure}
          onChange={(event, newValue) => {
            setDeparture(newValue.label);
            setDepartureCity(newValue.name);
          }}
          disablePortal
          options={options}
          sx={{ width: 280 }}
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
          sx={{ width: 280 }}
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

        <div className={styles.dateContainer}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={selectedDepartureDate}
              onChange={(date) => setSelectedDepartureDate(date)}
              sx={{
                width: 170,
              }}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={selectedArrivalDate}
              onChange={(date) => setSelectedArrivalDate(date)}
              sx={{
                width: 170,
              }}
            />
          </LocalizationProvider>
        </div>
        <Button
          size="large"
          variant="contained"
          sx={{
            backgroundColor: "#769259",
            "&:hover": {
              backgroundColor: "#325547",
            },
          }}
        >
          Search
        </Button>
      </div>

      <div className={styles.switchContainer}>
        <GreenSwitch {...label} defaultChecked />
        <p className={styles.switchText}>Find my accommodation</p>
      </div>
    </div>
  );
}
