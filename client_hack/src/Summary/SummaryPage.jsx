/* eslint-disable react/jsx-filename-extension */
import React, { useState } from 'react';
import { Typography, Button, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import LoadingButton from '../components/buttons/LoadingButton';
import ScreenGrid from '../components/ScreenGrid';

// information that needs to be shown on the summary page:
// 1. Survivability Score
// 2. Country Similarity
// 3. Artist Rankings (top 10)
// 4. Chart Mismatch Score

function CompareButton({ compareSimilariy, country1, country2 }) {
  const [isLoading, setLoading] = useState(false);

  async function handlePromote() {
    setLoading(true);
    await compareSimilariy(country1, country2);
    setLoading(false);
  }
  if (isLoading) {
    return <LoadingButton />;
  }
  return (
    <Button variant="contained" onClick={(e) => handlePromote}>
      Compare
    </Button>
  );
}

function SummaryPage() {
  // To Do - replace with call to database
  const [country1, setCountry1] = React.useState(null);
  const [country2, setCountry2] = React.useState(null);

  const countries = [
    'United States of America',
    'Canada',
    'Argentina',
    'Brazil',
    'Mexico',
    'France',
    'Spain',
    'United Kingdom',
  ];
  const handleChange = (event, setter) => {
    setter(event.target.value);
  };
  return (
    <div>
      <Typography variant="h3" textAlign="center" gutterBottom>
        Summary
      </Typography>
      <Typography variant="h5" textAlign="center" gutterBottom>
        Blah Blah Blah
      </Typography>
      <Grid
        container
        xs={12}
        justifyContent="space-around "
        // alignItems="center"
        flexDirection="row"
      >
        <Grid item>
          <Box sx={{ width: 300 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Country 1</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={country1}
                label="Country 1"
                onChange={(event) => handleChange(event, setCountry1)}
              >
                {countries.map((country) => {
                  return <MenuItem value={country}>{country}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid item>
          <Box sx={{ width: 300 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Country 2</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={country2}
                label="Country 1"
                onChange={(event) => handleChange(event, setCountry2)}
              >
                {countries
                  .filter((country) => country !== country1)
                  .map((country) => {
                    return <MenuItem value={country}>{country}</MenuItem>;
                  })}
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </Grid>
      <div style={{ margin: 'auto', width: '6%' }}>
        <CompareButton country1={country1} country2={country2} />
      </div>
    </div>
  );
}

export default SummaryPage;
