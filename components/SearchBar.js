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
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

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

  useEffect(() => {
    console.log("SELECTED DEPARTURE DATE IS", selectedDepartureDate);
  }, [selectedDepartureDate]);

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
  const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
    "&:active": {
      "& .MuiSwitch-thumb": {
        width: 15,
      },
      "& .MuiSwitch-switchBase.Mui-checked": {
        transform: "translateX(9px)",
      },
    },
    "& .MuiSwitch-switchBase": {
      padding: 2,
      "&.Mui-checked": {
        transform: "translateX(12px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor:
            theme.palette.mode === "dark" ? "#177ddc" : "#1890ff",
        },
      },
    },
    "& .MuiSwitch-thumb": {
      boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
      width: 12,
      height: 12,
      borderRadius: 6,
      transition: theme.transitions.create(["width"], {
        duration: 200,
      }),
    },
    "& .MuiSwitch-track": {
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,.35)"
          : "rgba(0,0,0,.25)",
      boxSizing: "border-box",
    },
  }));

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
      </div>

      <div className={styles.switchContainer}>
        <Stack direction="row" spacing={1} alignItems="center">
          <AntSwitch
            defaultChecked
            inputProps={{ "aria-label": "ant design" }}
          />
          <Typography>Find my accommodation</Typography>
        </Stack>
      </div>
    </div>
  );
}
