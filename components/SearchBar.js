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

  //Permettre de sélectionner Aller simple ou A/R
  const [oneOrRound, setOneOrRound] = useState("One-way");

  const [selectedDepartureDate, setSelectedDepartureDate] = useState(null);
  const [selectedArrivalDate, setSelectedArrivalDate] = useState(null);

  // Compteur billets adulte/jeune/senior
  const [adultCount, setAdultCount] = useState(1);
  const [youthCount, setYouthCount] = useState(0);
  const [seniorCount, setSeniorCount] = useState(0);
  const [nbOfPassengers, setNbOfPassengers] = useState(1);

  const handleChange = (event) => {
    setOneOrRound(event.target.value);
  };

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
          setOptions(formattedOptions);
        }
      });
  }, []);

  //A partir de la ville de départ, top 5 des destinations

  useEffect(() => {
    console.log("departure city updated", departureCity);
  }, [departureCity]);

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
          <Select className={styles.count} value={nbOfPassengers}>
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
                      ? (setAdultCount(adultCount - 1),
                        setNbOfPassengers(nbOfPassengers - 1))
                      : (setAdultCount(adultCount),
                        setNbOfPassengers(nbOfPassengers))
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
                  onClick={() => {
                    setAdultCount(adultCount + 1);
                    setNbOfPassengers(nbOfPassengers + 1);
                  }}
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
                  onClick={() => {
                    youthCount > 0
                      ? (setYouthCount(youthCount - 1),
                        setNbOfPassengers(nbOfPassengers - 1))
                      : (setYouthCount(youthCount),
                        setNbOfPassengers(nbOfPassengers));
                  }}
                >
                  -
                </button>
                <span className={styles.counter} id="counter">
                  {youthCount}
                </span>
                <button
                  className={styles.countBtn}
                  id="incrementBtn"
                  onClick={() => {
                    setYouthCount(youthCount + 1);
                    setNbOfPassengers(nbOfPassengers + 1);
                  }}
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
                  onClick={() => {
                    seniorCount > 0
                      ? (setSeniorCount(seniorCount - 1),
                        setNbOfPassengers(nbOfPassengers - 1))
                      : (setSeniorCount(seniorCount),
                        setNbOfPassengers(nbOfPassengers));
                  }}
                >
                  -
                </button>
                <span className={styles.counter} id="counter">
                  {seniorCount}
                </span>
                <button
                  className={styles.countBtn}
                  id="incrementBtn"
                  onClick={() => {
                    setSeniorCount(seniorCount + 1);
                    setNbOfPassengers(nbOfPassengers + 1);
                  }}
                >
                  +
                </button>
              </div>
            </MenuItem>

            {/* Nb of passengers in total */}
            <div value={nbOfPassengers} className={styles.counterContainer}>
              {nbOfPassengers} passenger(s)
            </div>
          </Select>
        </FormControl>
      </div>

      <div className={styles.autocompleteContainer}>
        <div className={styles.inputContainer}>
          <Autocomplete
            value={departure}
            disablePortal
            options={options}
            sx={{
              marginTop: "10px",
              marginRight: 1,
              width: {
                xs: "80vw",
                sm: "80vw",
                md: "50%",
              },
            }}
            inputValue={departure}
            //   Utilisation de la API pour autocomplete
            onInputChange={(event, newInputValue) => {
              fetch(
                `https://api.comparatrip.eu/cities/autocomplete/?q=${newInputValue}/`
              )
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
                  }
                });
            }}
            onChange={(event, newValue) => {
              console.log("NEW VALUE IS", newValue);
              setDeparture(newValue.label);
              setDepartureCity(newValue.name);

              fetch(
                `https://api.comparatrip.eu/cities/popular/from/${newValue.name}/5`
              )
                .then((response) => response.json())
                .then((data) => {
                  if (data) {
                    console.log("OPTIONS ARE", data);
                    let formattedTopDestinations = data.map((opt, i) => {
                      return {
                        label: opt.local_name,
                        id: opt.city_id,
                        name: opt.unique_name,
                      };
                    });
                    setArrivalOptions(formattedTopDestinations);
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
            sx={{
              marginTop: "10px",
              marginRight: 1,
              width: {
                xs: "80vw",
                sm: "80vw",
                md: "50%",
              },
            }}
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
                    setArrivalOptions(formattedOptions);
                  }
                });
            }}
            renderInput={(params) => (
              <TextField {...params} label="To : City, Station or Airport" />
            )}
          />
        </div>

        <div className={styles.dateContainer}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={selectedDepartureDate}
              onChange={(date) => setSelectedDepartureDate(date)}
              sx={{
                marginTop: "10px",
                marginRight: 1,
                width: {
                  xs: "50%",
                  sm: "50%",
                  md: "40%",
                },
              }}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={selectedArrivalDate}
              onChange={(date) => setSelectedArrivalDate(date)}
              sx={{
                marginTop: "10px",
                marginRight: 1,
                width: {
                  xs: "50%",
                  sm: "50%",
                  md: "40%",
                },
              }}
            />
          </LocalizationProvider>
        </div>
        <Button
          size="large"
          variant="contained"
          sx={{
            marginTop: "10px",
            marginRight: 1,
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
