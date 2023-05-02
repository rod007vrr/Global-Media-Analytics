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
import { getData } from '../util/api';
import config from '../config.json';
import PrimaryButton from '../components/buttons/PrimaryButton';

// information that needs to be shown on the summary page:
// 1. Survivability Score
// 2. Country Similarity
// 3. Artist Rankings (top 10)
// 4. Chart Mismatch Score

function CompareButton({ country1, country2, setSimilarity }) {
  const [isLoading, setLoading] = useState(false);

  async function handlePromote() {
    if (country1 === '' || country2 === '') {
      return;
    }
    setLoading(true);
    // findSimilarity();
    console.log('here');
    setLoading(false);
  }
  if (isLoading) {
    return <LoadingButton />;
  }
  return (
    <Button
      variant="contained"
      onClick={(_e) => handlePromote()}
      style={{ backgroundColor: '#1db954' }}
    >
      Compare
    </Button>
  );
}

function SimilarityPage() {
  const [country1, setCountry1] = React.useState('');
  const [country2, setCountry2] = React.useState('');
  const [similarity, setSimilarity] = useState(null);

  // To Do - replace with call to database
  const countries = [
    'United States',
    'Canada',
    'Argentina',
    'Brazil',
    'Mexico',
    'France',
    'Spain',
    'United Kingdom',
  ];

  const findSimilarity = () => {
    console.log('requested');
    fetch(
      `http://${config.server_host}:${config.server_port}/country_similarity?country1=${country1}&country2=${country2}`,
    )
      .then((res) => res.json())
      .then((resJson) => {
        // DataGrid expects an array of objects with a unique id.
        // To accomplish this, we use a map with spread syntax (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax)
        const result = resJson.score;
        setSimilarity(result);
      });
  };

  const handleChange = (event, setter) => {
    setter(event.target.value);
  };
  return (
    <div>
      <Typography variant="h3" textAlign="center" gutterBottom margin="30px">
        Similarity
      </Typography>
      <Typography variant="h5" textAlign="center" gutterBottom margin="10px">
        Pick two countries to compare their top charts:
      </Typography>
      <Grid
        container
        xs={12}
        justifyContent="space-around"
        // alignItems="center"
        flexDirection="row"
        margin="30px"
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
        <CompareButton
          country1={country1}
          country2={country2}
          setSimilarity={setSimilarity}
        >
          Compare
        </CompareButton>
      </div>
      {similarity ? (
        <Typography variant="h4" textAlign="center" margin="70px">
          Similarity Score: {similarity}
        </Typography>
      ) : null}
    </div>
  );
}

export default SimilarityPage;
